import express from "express";
import { fetchCountrydata } from "../services/data.js";
import { fetchAndStoreCountries, getAllCountries } from "../services/country.js";

const router = express.Router();

type CollectRequestBody = {
  countryCode?: unknown;
};

const getSingleQueryValue = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

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
    const message = getErrorMessage(error);
    console.error("Error storing countries:", message);
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/countries — get countries from the database
router.get("/countries", async (req, res) => {
  try {
    const region = getSingleQueryValue(req.query.region);
    const incomeLevel = getSingleQueryValue(req.query.income_level);
    const limit = getSingleQueryValue(req.query.limit);
    const countries = await getAllCountries({
      region,
      incomeLevel,
      limit: limit ? Number.parseInt(limit, 10) : 300,
    });

    res.json({
      success: true,
      count: countries.length,
      data: countries,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Error fetching countries:", message);
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/collect — fetch GDP + Population for a single country (live from API)
router.post("/collect", async (req: express.Request<{}, unknown, CollectRequestBody>, res) => {
  try {
    const { countryCode } = req.body;

    if (typeof countryCode !== "string" || countryCode.length === 0) {
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
    console.error("Error in /collect route:", getErrorMessage(error));
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

export default router;
