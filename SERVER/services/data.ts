import pool from "../config/db.js";

interface CountryDataItem {
  countryiso3code: string;
  country: { value: string };
  indicator: { id: string; value: string };
  date: string;
  value: number;
  unit: string;
  decimal: number;
}

export interface CountryData {
  gdpData: CountryDataItem[];
  popData: CountryDataItem[];
}

interface StoredIndicatorRow {
  country_code: string;
  country_name: string;
  year: number;
  value: string | number;
  indicator_id: string;
  indicator_name: string;
  unit: string | null;
  decimal_places: number | null;
}

const toCountryDataItem = (row: StoredIndicatorRow): CountryDataItem => ({
  countryiso3code: row.country_code,
  country: { value: row.country_name },
  indicator: { id: row.indicator_id, value: row.indicator_name },
  date: String(row.year),
  value: Number(row.value),
  unit: row.unit ?? "",
  decimal: row.decimal_places ?? 0,
});

// Read country history from PostgreSQL. The World Bank API is only contacted by
// the explicit data-refresh endpoint (POST /api/economy/store).
export const fetchCountrydata = async (
  countryCode: string
): Promise<CountryData | null> => {
  const normalizedCode = countryCode.trim().toUpperCase();

  const [gdpResult, populationResult] = await Promise.all([
    pool.query<StoredIndicatorRow>(
      `SELECT
         g.country_code,
         c.country_name,
         g.year,
         g.gdp AS value,
         g.indicator_id,
         g.indicator_name,
         g.unit,
         g.decimal_places
       FROM gdp_data g
       INNER JOIN countries c ON c.country_code = g.country_code
       WHERE g.country_code = $1 AND g.gdp IS NOT NULL
       ORDER BY g.year DESC`,
      [normalizedCode]
    ),
    pool.query<StoredIndicatorRow>(
      `SELECT
         p.country_code,
         c.country_name,
         p.year,
         p.population AS value,
         p.indicator_id,
         p.indicator_name,
         p.unit,
         p.decimal_places
       FROM population_data p
       INNER JOIN countries c ON c.country_code = p.country_code
       WHERE p.country_code = $1 AND p.population IS NOT NULL
       ORDER BY p.year DESC`,
      [normalizedCode]
    ),
  ]);

  if (gdpResult.rows.length === 0 || populationResult.rows.length === 0) {
    return null;
  }

  return {
    gdpData: gdpResult.rows.map(toCountryDataItem),
    popData: populationResult.rows.map(toCountryDataItem),
  };
};
