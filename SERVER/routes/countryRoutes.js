import express from "express";
import { fetchCountrydata } from "../services/data.js";

const router = express.Router();

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
