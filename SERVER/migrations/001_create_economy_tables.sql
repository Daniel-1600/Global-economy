-- ============================================
-- Economy Data Storage Schema
-- File: 001_create_economy_tables.sql
-- ============================================

-- Table 1: Countries
-- Stores basic country information
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(3) UNIQUE NOT NULL,
  country_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: GDP Data
-- Stores GDP values for each country by year
CREATE TABLE IF NOT EXISTS gdp_data (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(3) NOT NULL,
  year INTEGER NOT NULL,
  gdp BIGINT,
  indicator_id VARCHAR(50),
  indicator_name VARCHAR(255),
  unit VARCHAR(50) DEFAULT 'Current US$',
  decimal_places INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Prevent duplicate country+year combinations
  UNIQUE(country_code, year),
  
  -- Link to countries table
  FOREIGN KEY (country_code) 
    REFERENCES countries(country_code) 
    ON DELETE CASCADE
);

-- Table 3: Continent Summaries
-- Stores aggregated data for each continent
CREATE TABLE IF NOT EXISTS continent_summaries (
  id SERIAL PRIMARY KEY,
  continent_code VARCHAR(50) NOT NULL,
  continent_name VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  total_gdp BIGINT,
  average_gdp BIGINT,
  country_count INTEGER,
  top_country_code VARCHAR(3),
  top_country_name VARCHAR(255),
  top_country_gdp BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Prevent duplicate continent+year combinations
  UNIQUE(continent_code, year)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_gdp_year ON gdp_data(year);
CREATE INDEX IF NOT EXISTS idx_gdp_country ON gdp_data(country_code);
CREATE INDEX IF NOT EXISTS idx_gdp_country_year ON gdp_data(country_code, year);
CREATE INDEX IF NOT EXISTS idx_continent_summary_year ON continent_summaries(year);

-- Insert continent reference data
INSERT INTO continent_summaries (continent_code, continent_name, year, total_gdp, average_gdp, country_count)
VALUES 
  ('africa', 'Africa', 0, 0, 0, 0),
  ('asia', 'Asia', 0, 0, 0, 0),
  ('europe', 'Europe', 0, 0, 0, 0),
  ('americas', 'Americas', 0, 0, 0, 0),
  ('oceania', 'Oceania', 0, 0, 0, 0)
ON CONFLICT (continent_code, year) DO NOTHING;

-- Success message
SELECT 'Database tables created successfully! ✅' AS status;