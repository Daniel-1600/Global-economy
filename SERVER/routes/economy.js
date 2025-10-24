import express from "express";
import axios from "axios";
const router = express.Router();

// Region/Continent mapping for World Bank API
const REGION_CODES = {
  africa: ["SSF", "SSA"], // Sub-Saharan Africa
  asia: ["EAS", "SAS", "ECS"], // East Asia, South Asia, Europe & Central Asia
  europe: ["ECS", "EMU"], // Europe & Central Asia, European Union
  americas: ["LCN", "NAC"], // Latin America & Caribbean, North America
  middleEast: ["MEA"], // Middle East & North Africa
  global: "all",
};

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

export default router;
