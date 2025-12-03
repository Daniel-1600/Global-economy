import axios from "axios";

export const fetchCountrydata = async (countryCode) => {
  try {
    const gdpUrl = `https://api.worldbank.org/v2/country/${encodeURIComponent(
      countryCode
    )}/indicator/NY.GDP.MKTP.CD?format=json`;
    const popUrl = `https://api.worldbank.org/v2/country/${encodeURIComponent(
      countryCode
    )}/indicator/SP.POP.TOTL?format=json`;

    let gdpRes, popRes;

    try {
      gdpRes = await axios.get(gdpUrl);
      console.log("✅ GDP Response received");
    } catch (gdpError) {
      console.error("❌ Failed to fetch GDP data:", gdpError.message);
      if (gdpError.response) {
        console.error("GDP API Status:", gdpError.response.status);
        console.error("GDP API Message:", gdpError.response.statusText);
      }
      throw new Error(`Failed to fetch GDP data: ${gdpError.message}`);
    }

    try {
      popRes = await axios.get(popUrl);
      console.log("✅ Population Response received");
    } catch (popError) {
      console.error("❌ Failed to fetch Population data:", popError.message);
      if (popError.response) {
        console.error("Population API Status:", popError.response.status);
        console.error("Population API Message:", popError.response.statusText);
      }
      throw new Error(`Failed to fetch Population data: ${popError.message}`);
    }

    const gdpData = gdpRes.data[1];
    const popData = popRes.data[1];

    if (!gdpData || !popData || gdpData.length === 0 || popData.length === 0) {
      console.log("No data found for country code:", countryCode);
      return null;
    }

    return { gdpData, popData };
  } catch (error) {
    console.error("Failed to fetch country data:", error.message, error.code);
    throw error;
  }
};
