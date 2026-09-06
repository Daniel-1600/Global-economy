
  import axios from "axios";

  interface WorldBankGDPItem {
    countryiso3code: string;
    country: { value: string };
    indicator: { id: string; value: string };
    date: string;
    value: number | null;
    unit: string;
    decimal: number;
  }

  export interface CountryAPIData {
    gdpData: WorldBankGDPItem[];
    popData: WorldBankGDPItem[];
  }

  export const fetchCountrydata = async (countryCode: string): Promise<CountryAPIData | null> => {
    const base = "https://api.worldbank.org/v2/country";
    const encoded = encodeURIComponent(countryCode);

    const [gdpRes, popRes] = await Promise.all([
      axios.get(`${base}/${encoded}/indicator/NY.GDP.MKTP.CD?format=json`),
      axios.get(`${base}/${encoded}/indicator/SP.POP.TOTL?format=json`),
    ]);

    const gdpData = gdpRes.data[1];
    const popData = popRes.data[1];

    if (!gdpData || !popData || gdpData.length === 0 || popData.length === 0) {
      return null;
    }

    return { gdpData, popData };
  };
