-- ============================================
-- Enrich Countries Table
-- File: 002_enrich_countries.sql
-- Adds region, income level, capital city, and coordinates
-- ============================================

ALTER TABLE countries ADD COLUMN IF NOT EXISTS iso2_code VARCHAR(2);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS income_level VARCHAR(50);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS capital_city VARCHAR(255);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS longitude DECIMAL(10,6);
ALTER TABLE countries ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,6);

-- Create an index on region so filtering by region is fast
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region);

-- Create an index on income_level so filtering by income level is fast
CREATE INDEX IF NOT EXISTS idx_countries_income ON countries(income_level);

SELECT 'Countries table enriched successfully!' AS status;