import axios from "axios";
import pool from "../config/db.js";

 interface WorldBankCountry {
    id: string;
    name: string;
    iso2Code: string;
    region: {
      value: string;
    };
    incomeLevel: {
      value: string;
    };
    capitalCity: string;
    longitude: string;
    latitude: string;
  }

  interface CountryFilters {
    region?: string;
    incomeLevel?: string;
    limit?: number;
  }

  interface StoreCountriesResult {
    stored: number;
    skipped: number;
  }

// Fetch all countries from World Bank API and store them in the database
export const fetchAndStoreCountries = async ():Promise<StoreCountriesResult> => {
  const response = await axios.get<[unknown, WorldBankCountry[]]>(
    "https://api.worldbank.org/v2/country/all?format=json&per_page=300"
  );

  const countries = response.data[1];

  if (!countries || countries.length === 0) {
    throw new Error("No country data received from World Bank API");
  }

  const client = await pool.connect();
  let stored = 0;
  let skipped = 0;

  try {
    await client.query("BEGIN");

    for (const country of countries) {
      // Skip non-country entries (regions, aggregates have codes that aren't 3 letters)
      if (!country.id || country.id.length !== 3) {
        skipped++;
        continue;
      }

      await client.query(
        `INSERT INTO countries (
          country_code, country_name, iso2_code,
          region, income_level, capital_city,
          longitude, latitude
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (country_code)
        DO UPDATE SET
          country_name = EXCLUDED.country_name,
          iso2_code = EXCLUDED.iso2_code,
          region = EXCLUDED.region,
          income_level = EXCLUDED.income_level,
          capital_city = EXCLUDED.capital_city,
          longitude = EXCLUDED.longitude,
          latitude = EXCLUDED.latitude,
          updated_at = NOW()`,
        [
          country.id,
          country.name,
          country.iso2Code,
          country.region.value,
          country.incomeLevel.value,
          country.capitalCity || null,
          country.longitude || null,
          country.latitude || null,
        ]
      );
      stored++;
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return { stored, skipped };
};

// Get all countries from the database
export const getAllCountries = async ({ region, incomeLevel, limit = 300 }:CountryFilters = {}) => {
  let query = "SELECT * FROM countries WHERE 1=1";
  const params = [];

  if (region) {
    params.push(region);
    query += ` AND region = $${params.length}`;
  }

  if (incomeLevel) {
    params.push(incomeLevel);
    query += ` AND income_level = $${params.length}`;
  }

  query += " ORDER BY country_name";
  params.push(limit);
  query += ` LIMIT $${params.length}`;

  const result = await pool.query(query, params);
  return result.rows;
};
