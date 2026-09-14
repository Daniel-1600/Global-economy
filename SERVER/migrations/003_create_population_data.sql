-- Stores population values used by the country data explorer.
CREATE TABLE IF NOT EXISTS population_data (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(3) NOT NULL,
  year INTEGER NOT NULL,
  population BIGINT,
  indicator_id VARCHAR(50),
  indicator_name VARCHAR(255),
  unit VARCHAR(50) DEFAULT 'People',
  decimal_places INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(country_code, year),
  FOREIGN KEY (country_code)
    REFERENCES countries(country_code)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_population_country_year
  ON population_data(country_code, year);
CREATE INDEX IF NOT EXISTS idx_population_year ON population_data(year);
