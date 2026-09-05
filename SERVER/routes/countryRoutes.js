import express from "express";
import { fetchCountrydata } from "../services/data.js";
import { fetchAndStoreCountries, getAllCountries } from "../services/country.js";

const router = express.Router();

// POST /api/countries/store — fetch all countries from World Bank and save to DB
router.post("/countries/store", async (req, res) => {
  try {
    console.log("Fetching countries from World Bank API...");
    const result = await fetchAndStoreCountries();
    console.log(`Stored ${result.stored} countries, skipped ${result.skipped} non-country entries`);

    res.json({
      success: true,
      message: "Countries stored successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error storing countries:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/countries — get countries from the database
router.get("/countries", async (req, res) => {
  try {
    const { region, income_level, limit } = req.query;
    const countries = await getAllCountries({
      region,
      incomeLevel: income_level,
      limit: limit ? parseInt(limit) : 300,
    });

    res.json({
      success: true,
      count: countries.length,
      data: countries,
    });
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/collect — fetch GDP + Population for a single country (live from API)
router.post("/collect", async (req, res) => {
  try {
    const { countryCode } = req.body;

    if (!countryCode) {
      return res.status(400).json({ error: "countryCode is required" });
    }

    const data = await fetchCountrydata(countryCode);

    if (!data || !data.gdpData || !data.popData) {
      return res.status(404).json({
        error:
          "No data found for this country code. Please use a valid 3-letter code (e.g., USA, IND, CHN)",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Error in /collect route:", error.message);
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

export default router;