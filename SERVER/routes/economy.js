import express from "express";
import axios from "axios";
const router = express.Router();
import pool from "../config/db.js";

// Region/Continent mapping for World Bank API
const REGION_CODES = {
  africa: ["SSF", "SSA"], // Sub-Saharan Africa
  asia: ["EAS", "SAS", "ECS"], // East Asia, South Asia, Europe & Central Asia
  europe: ["ECS", "EMU"], // Europe & Central Asia, European Union
  americas: ["LCN", "NAC"], // Latin America & Caribbean, North America
  middleEast: ["MEA"], // Middle East & North Africa
  global: "all",
};

router.post("/economy/store", async (req, res) => {
  try {
    console.log("starting to fetch and store data");
    const response = await axios.get(
      "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=20000"
    );

    const rawData = response.data[1];
    if (!rawData || rawData.length === 0) {
      res.status(400).json({ message: "no data retrieved" });
    }

    console.log(`fetched ${rawData.length} records from the worldbank`);

    //cleaning the data now
    const structuredData = rawData
      .filter((item) => item.value !== null && item.countryiso3code)
      .map((item) => ({
        countryCode: item.countryiso3code,
        countryName: item.country.value,
        indicatorId: item.indicator.id,
        indicatorName: item.indicator.value,
        year: parseInt(item.date),
        gdp: Math.round(item.value),
        unit: item.unit || "Current US$",
        decimal: item.decimal || 0,
      }));

    console.log(`cleaned data : ${structuredData.length} valid records `);

    //storing in the database
    const client = await pool.connect();
    let countriesInserted = 0;
    let gdpRecordsInserted = 0;

    try {
      await client.query("BEGIN");

      for (const record of structuredData) {
        await client.query(
          `INSERT INTO countries (country_code, country_name)
           VALUES ($1, $2)
           ON CONFLICT (country_code) 
           DO UPDATE SET 
             country_name = EXCLUDED.country_name,
             updated_at = NOW()`,
          [record.countryCode, record.countryName]
        );
        countriesInserted++;

        if (countriesInserted % 50 === 0) {
          console.log(
            `📊 Countries: ${countriesInserted}/${structuredData.length}`
          );
        }
      }

      console.log(`✅ Processed ${countriesInserted} countries`);
      for (const record of structuredData) {
        await client.query(
          `INSERT INTO gdp_data (
            country_code, year, gdp, 
            indicator_id, indicator_name, 
            unit, decimal_places
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (country_code, year) 
          DO UPDATE SET
            gdp = EXCLUDED.gdp,
            indicator_id = EXCLUDED.indicator_id,
            indicator_name = EXCLUDED.indicator_name,
            unit = EXCLUDED.unit,
            decimal_places = EXCLUDED.decimal_places,
            updated_at = NOW()`,
          [
            record.countryCode,
            record.year,
            record.gdp,
            record.indicatorId,
            record.indicatorName,
            record.unit,
            record.decimal,
          ]
        );
        gdpRecordsInserted++;

        if (gdpRecordsInserted % 100 === 0) {
          console.log(
            `📈 GDP Records: ${gdpRecordsInserted}/${structuredData.length}`
          );
        }
      }

      await client.query("COMMIT");
      console.log("✅ All data committed to database!");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    console.log("📊 Calculating continent summaries...");
    await storeContinentSummaries();

    // Success response
    res.json({
      success: true,
      message: "Data stored successfully in PostgreSQL",
      stored: {
        countries: countriesInserted,
        gdpRecords: gdpRecordsInserted,
        totalRecords: structuredData.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("error storing data", error.message);
    res.status(500).json({
      success: false,
      message: "error storing data",
      error: error.message,
    });
  }
});

// GET /api/economy/stored - View data from database
router.get("/economy/stored", async (req, res) => {
  try {
    const { table = "gdp_data", limit = 100 } = req.query;

    let query;
    let params = [limit];

    if (table === "countries") {
      query = `
        SELECT * FROM countries
        ORDER BY country_name
        LIMIT $1
      `;
    } else if (table === "gdp_data") {
      query = `
        SELECT g.*, c.country_name
        FROM gdp_data g
        LEFT JOIN countries c ON g.country_code = c.country_code
        ORDER BY g.year DESC, g.gdp DESC
        LIMIT $1
      `;
    } else if (table === "continent_summaries") {
      query = `
        SELECT * FROM continent_summaries
        ORDER BY year DESC, total_gdp DESC
        LIMIT $1
      `;
    } else {
      return res.status(400).json({ error: "Invalid table name" });
    }

    const result = await pool.query(query, params);

    res.json({
      table,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching stored data:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/economy", async (req, res) => {
  try {
    // Get region from query parameter (e.g., /api/economy?region=asia)
    const region = req.query.region?.toLowerCase() || "global";

    // Determine which countries/regions to query
    let regionCode = "all"; // default to all countries

    if (region !== "global" && REGION_CODES[region]) {
      // For specific regions, we'll filter after fetching all data
      // World Bank doesn't have perfect continent grouping, so we'll use all data and filter
      regionCode = "all";
    }

    const response = await axios.get(
      `https://api.worldbank.org/v2/country/${regionCode}/indicator/NY.GDP.MKTP.CD?format=json&per_page=20000`
    );

    // World Bank API returns [metadata, data]
    const rawData = response.data[1];

    if (!rawData || rawData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data available",
      });
    }

    // Structure the data properly
    let structuredData = rawData
      .filter((item) => item.value !== null) // Remove null values
      .map((item) => ({
        country: {
          id: item.country.id,
          name: item.country.value,
        },
        countryCode: item.countryiso3code,
        indicator: {
          id: item.indicator.id,
          name: item.indicator.value,
        },
        year: parseInt(item.date),
        gdp: item.value,
        unit: item.unit || "Current US$",
        decimal: item.decimal || 0,
      }))
      .sort((a, b) => b.year - a.year); // Sort by most recent year first

    // Filter by continent if specified
    if (region !== "global") {
      structuredData = filterByContinent(structuredData, region);
    }

    // Calculate continent summaries
    const continentSummaries = calculateContinentSummaries(structuredData);

    // Send structured response
    res.json({
      success: true,
      count: structuredData.length,
      region: region,
      continentSummaries: continentSummaries, // Added continent summaries first
      data: structuredData,
      metadata: {
        indicator: "GDP (Current US$)",
        source: "World Bank API",
        lastUpdated: new Date().toISOString(),
        availableRegions: Object.keys(REGION_CODES),
      },
    });
  } catch (error) {
    console.error("Error fetching economy data:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching economy data",
      error: error.message,
    });
  }
});

// Helper function to filter by continent based on country codes
function filterByContinent(data, continent) {
  // Country code mappings by continent
  const continentCountries = {
    africa: [
      "DZA",
      "AGO",
      "BEN",
      "BWA",
      "BFA",
      "BDI",
      "CMR",
      "CPV",
      "CAF",
      "TCD",
      "COM",
      "COG",
      "COD",
      "CIV",
      "DJI",
      "EGY",
      "GNQ",
      "ERI",
      "ETH",
      "GAB",
      "GMB",
      "GHA",
      "GIN",
      "GNB",
      "KEN",
      "LSO",
      "LBR",
      "LBY",
      "MDG",
      "MWI",
      "MLI",
      "MRT",
      "MUS",
      "MAR",
      "MOZ",
      "NAM",
      "NER",
      "NGA",
      "RWA",
      "STP",
      "SEN",
      "SYC",
      "SLE",
      "SOM",
      "ZAF",
      "SSD",
      "SDN",
      "SWZ",
      "TZA",
      "TGO",
      "TUN",
      "UGA",
      "ZMB",
      "ZWE",
    ],
    asia: [
      "AFG",
      "ARM",
      "AZE",
      "BHR",
      "BGD",
      "BTN",
      "BRN",
      "KHM",
      "CHN",
      "GEO",
      "HKG",
      "IND",
      "IDN",
      "IRN",
      "IRQ",
      "ISR",
      "JPN",
      "JOR",
      "KAZ",
      "KWT",
      "KGZ",
      "LAO",
      "LBN",
      "MAC",
      "MYS",
      "MDV",
      "MNG",
      "MMR",
      "NPL",
      "PRK",
      "OMN",
      "PAK",
      "PSE",
      "PHL",
      "QAT",
      "SAU",
      "SGP",
      "KOR",
      "LKA",
      "SYR",
      "TWN",
      "TJK",
      "THA",
      "TLS",
      "TUR",
      "TKM",
      "ARE",
      "UZB",
      "VNM",
      "YEM",
    ],
    europe: [
      "ALB",
      "AND",
      "AUT",
      "BLR",
      "BEL",
      "BIH",
      "BGR",
      "HRV",
      "CYP",
      "CZE",
      "DNK",
      "EST",
      "FIN",
      "FRA",
      "DEU",
      "GRC",
      "HUN",
      "ISL",
      "IRL",
      "ITA",
      "XKX",
      "LVA",
      "LIE",
      "LTU",
      "LUX",
      "MKD",
      "MLT",
      "MDA",
      "MCO",
      "MNE",
      "NLD",
      "NOR",
      "POL",
      "PRT",
      "ROU",
      "RUS",
      "SMR",
      "SRB",
      "SVK",
      "SVN",
      "ESP",
      "SWE",
      "CHE",
      "UKR",
      "GBR",
      "VAT",
    ],
    americas: [
      "ATG",
      "ARG",
      "BHS",
      "BRB",
      "BLZ",
      "BOL",
      "BRA",
      "CAN",
      "CHL",
      "COL",
      "CRI",
      "CUB",
      "DMA",
      "DOM",
      "ECU",
      "SLV",
      "GRD",
      "GTM",
      "GUY",
      "HTI",
      "HND",
      "JAM",
      "MEX",
      "NIC",
      "PAN",
      "PRY",
      "PER",
      "KNA",
      "LCA",
      "VCT",
      "SUR",
      "TTO",
      "USA",
      "URY",
      "VEN",
    ],
    oceania: [
      "AUS",
      "FJI",
      "KIR",
      "MHL",
      "FSM",
      "NRU",
      "NZL",
      "PLW",
      "PNG",
      "WSM",
      "SLB",
      "TON",
      "TUV",
      "VUT",
    ],
  };

  const targetCountries = continentCountries[continent.toLowerCase()];

  if (!targetCountries) {
    return data; // Return all if continent not found
  }

  return data.filter((item) => targetCountries.includes(item.countryCode));
}

// Helper function to calculate continent summaries
function calculateContinentSummaries(data) {
  const continents = ["africa", "asia", "europe", "americas", "oceania"];
  const summaries = [];

  // Get the latest year in the dataset
  const latestYear = Math.max(...data.map((item) => item.year));

  continents.forEach((continent) => {
    // Filter data for this continent
    const continentData = filterByContinent(data, continent);

    // Get only latest year data for this continent
    const latestYearData = continentData.filter(
      (item) => item.year === latestYear
    );

    if (latestYearData.length > 0) {
      // Calculate total GDP for the continent
      const totalGDP = latestYearData.reduce((sum, item) => sum + item.gdp, 0);

      // Get top country
      const topCountry = latestYearData.reduce((max, item) =>
        item.gdp > max.gdp ? item : max
      );

      // Calculate average GDP
      const averageGDP = totalGDP / latestYearData.length;

      // Count countries
      const countryCount = latestYearData.length;

      summaries.push({
        continent: continent.charAt(0).toUpperCase() + continent.slice(1),
        continentCode: continent,
        year: latestYear,
        totalGDP: totalGDP,
        averageGDP: averageGDP,
        countryCount: countryCount,
        topCountry: {
          name: topCountry.country.name,
          code: topCountry.countryCode,
          gdp: topCountry.gdp,
        },
        gdpFormatted: {
          total: `$${(totalGDP / 1000000000000).toFixed(2)}T`,
          average: `$${(averageGDP / 1000000000000).toFixed(2)}T`,
          topCountry: `$${(topCountry.gdp / 1000000000000).toFixed(2)}T`,
        },
      });
    }
  });

  // Sort by total GDP (highest first)
  summaries.sort((a, b) => b.totalGDP - a.totalGDP);

  return summaries;
}

// Helper function to calculate and store continent summaries in database
async function storeContinentSummaries() {
  const continents = {
    africa: [
      "DZA",
      "AGO",
      "BEN",
      "BWA",
      "BFA",
      "BDI",
      "CMR",
      "CPV",
      "CAF",
      "TCD",
      "COM",
      "COG",
      "COD",
      "CIV",
      "DJI",
      "EGY",
      "GNQ",
      "ERI",
      "ETH",
      "GAB",
      "GMB",
      "GHA",
      "GIN",
      "GNB",
      "KEN",
      "LSO",
      "LBR",
      "LBY",
      "MDG",
      "MWI",
      "MLI",
      "MRT",
      "MUS",
      "MAR",
      "MOZ",
      "NAM",
      "NER",
      "NGA",
      "RWA",
      "STP",
      "SEN",
      "SYC",
      "SLE",
      "SOM",
      "ZAF",
      "SSD",
      "SDN",
      "SWZ",
      "TZA",
      "TGO",
      "TUN",
      "UGA",
      "ZMB",
      "ZWE",
    ],
    asia: [
      "AFG",
      "ARM",
      "AZE",
      "BHR",
      "BGD",
      "BTN",
      "BRN",
      "KHM",
      "CHN",
      "GEO",
      "HKG",
      "IND",
      "IDN",
      "IRN",
      "IRQ",
      "ISR",
      "JPN",
      "JOR",
      "KAZ",
      "KWT",
      "KGZ",
      "LAO",
      "LBN",
      "MAC",
      "MYS",
      "MDV",
      "MNG",
      "MMR",
      "NPL",
      "PRK",
      "OMN",
      "PAK",
      "PSE",
      "PHL",
      "QAT",
      "SAU",
      "SGP",
      "KOR",
      "LKA",
      "SYR",
      "TWN",
      "TJK",
      "THA",
      "TLS",
      "TUR",
      "TKM",
      "ARE",
      "UZB",
      "VNM",
      "YEM",
    ],
    europe: [
      "ALB",
      "AND",
      "AUT",
      "BLR",
      "BEL",
      "BIH",
      "BGR",
      "HRV",
      "CYP",
      "CZE",
      "DNK",
      "EST",
      "FIN",
      "FRA",
      "DEU",
      "GRC",
      "HUN",
      "ISL",
      "IRL",
      "ITA",
      "XKX",
      "LVA",
      "LIE",
      "LTU",
      "LUX",
      "MKD",
      "MLT",
      "MDA",
      "MCO",
      "MNE",
      "NLD",
      "NOR",
      "POL",
      "PRT",
      "ROU",
      "RUS",
      "SMR",
      "SRB",
      "SVK",
      "SVN",
      "ESP",
      "SWE",
      "CHE",
      "UKR",
      "GBR",
      "VAT",
    ],
    americas: [
      "ATG",
      "ARG",
      "BHS",
      "BRB",
      "BLZ",
      "BOL",
      "BRA",
      "CAN",
      "CHL",
      "COL",
      "CRI",
      "CUB",
      "DMA",
      "DOM",
      "ECU",
      "SLV",
      "GRD",
      "GTM",
      "GUY",
      "HTI",
      "HND",
      "JAM",
      "MEX",
      "NIC",
      "PAN",
      "PRY",
      "PER",
      "KNA",
      "LCA",
      "VCT",
      "SUR",
      "TTO",
      "USA",
      "URY",
      "VEN",
    ],
    oceania: [
      "AUS",
      "FJI",
      "KIR",
      "MHL",
      "FSM",
      "NRU",
      "NZL",
      "PLW",
      "PNG",
      "WSM",
      "SLB",
      "TON",
      "TUV",
      "VUT",
    ],
  };

  try {
    // Get latest year from database
    const latestYearResult = await pool.query(
      "SELECT MAX(year) as latest_year FROM gdp_data"
    );

    const latestYear = latestYearResult.rows[0]?.latest_year;

    if (!latestYear) {
      console.log("⚠️ No data in database yet");
      return;
    }

    console.log(`📅 Latest year in database: ${latestYear}`);

    // Loop through each continent
    for (const [continentCode, countryCodes] of Object.entries(continents)) {
      // Get GDP data for all countries in this continent for the latest year
      const result = await pool.query(
        `SELECT 
          country_code,
          gdp,
          year
         FROM gdp_data
         WHERE country_code = ANY($1)
           AND year = $2
           AND gdp IS NOT NULL
         ORDER BY gdp DESC`,
        [countryCodes, latestYear]
      );

      if (result.rows.length === 0) {
        console.log(`⚠️ No data for ${continentCode}`);
        continue;
      }

      // Calculate total GDP
      const totalGDP = result.rows.reduce(
        (sum, row) => sum + BigInt(row.gdp),
        BigInt(0)
      );

      // Calculate average GDP
      const avgGDP = totalGDP / BigInt(result.rows.length);

      // Get top country (first row is highest due to ORDER BY gdp DESC)
      const topCountry = result.rows[0];

      // Get country name for top country
      const countryNameResult = await pool.query(
        "SELECT country_name FROM countries WHERE country_code = $1",
        [topCountry.country_code]
      );

      // Insert or update continent summary
      await pool.query(
        `INSERT INTO continent_summaries (
          continent_code, continent_name, year,
          total_gdp, average_gdp, country_count,
          top_country_code, top_country_name, top_country_gdp
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (continent_code, year)
        DO UPDATE SET
          total_gdp = EXCLUDED.total_gdp,
          average_gdp = EXCLUDED.average_gdp,
          country_count = EXCLUDED.country_count,
          top_country_code = EXCLUDED.top_country_code,
          top_country_name = EXCLUDED.top_country_name,
          top_country_gdp = EXCLUDED.top_country_gdp,
          updated_at = NOW()`,
        [
          continentCode,
          continentCode.charAt(0).toUpperCase() + continentCode.slice(1),
          latestYear,
          totalGDP.toString(),
          avgGDP.toString(),
          result.rows.length,
          topCountry.country_code,
          countryNameResult.rows[0].country_name,
          topCountry.gdp,
        ]
      );

      console.log(
        `✅ ${continentCode}: ${result.rows.length} countries, Total GDP: $${(
          Number(totalGDP) / 1000000000000
        ).toFixed(2)}T`
      );
    }

    console.log("✅ Continent summaries stored successfully!");
  } catch (error) {
    console.error("❌ Error storing continent summaries:", error.message);
    throw error;
  }
}

export default router;
