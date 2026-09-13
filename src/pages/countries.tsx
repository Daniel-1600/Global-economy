"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import WorkspaceShell from "@/components/WorkspaceShell";

interface CountryData {
  country: { name: string; id: string };
  countryCode: string;
  year: number;
  gdp: number;
  indicator: { name: string };
}

// Continent to country code mapping (moved outside component for stability)
const CONTINENT_MAPPING: { [key: string]: string[] } = {
  Africa: [
    "DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CMR", "CPV", "CAF", "TCD",
    "COM", "COG", "COD", "CIV", "DJI", "EGY", "GNQ", "ERI", "ETH", "GAB",
    "GMB", "GHA", "GIN", "GNB", "KEN", "LSO", "LBR", "LBY", "MDG", "MWI",
    "MLI", "MRT", "MUS", "MAR", "MOZ", "NAM", "NER", "NGA", "RWA", "STP",
    "SEN", "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "SWZ", "TZA", "TGO",
    "TUN", "UGA", "ZMB", "ZWE",
  ],
  Asia: [
    "AFG", "ARM", "AZE", "BHR", "BGD", "BTN", "BRN", "KHM", "CHN", "GEO",
    "HKG", "IND", "IDN", "IRN", "IRQ", "ISR", "JPN", "JOR", "KAZ", "KWT",
    "KGZ", "LAO", "LBN", "MAC", "MYS", "MDV", "MNG", "MMR", "NPL", "PRK",
    "OMN", "PAK", "PSE", "PHL", "QAT", "SAU", "SGP", "KOR", "LKA", "SYR",
    "TWN", "TJK", "THA", "TLS", "TUR", "TKM", "ARE", "UZB", "VNM", "YEM",
  ],
  Europe: [
    "ALB", "AND", "AUT", "BLR", "BEL", "BIH", "BGR", "HRV", "CYP", "CZE",
    "DNK", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ITA",
    "XKX", "LVA", "LIE", "LTU", "LUX", "MKD", "MLT", "MDA", "MCO", "MNE",
    "NLD", "NOR", "POL", "PRT", "ROU", "RUS", "SMR", "SRB", "SVK", "SVN",
    "ESP", "SWE", "CHE", "UKR", "GBR", "VAT",
  ],
  Americas: [
    "ATG", "ARG", "BHS", "BRB", "BLZ", "BOL", "BRA", "CAN", "CHL", "COL",
    "CRI", "CUB", "DMA", "DOM", "ECU", "SLV", "GRD", "GTM", "GUY", "HTI",
    "HND", "JAM", "MEX", "NIC", "PAN", "PRY", "PER", "KNA", "LCA", "VCT",
    "SUR", "TTO", "USA", "URY", "VEN",
  ],
  Oceania: [
    "AUS", "FJI", "KIR", "MHL", "FSM", "NRU", "NZL", "PLW", "PNG", "WSM",
    "SLB", "TON", "TUV", "VUT",
  ],
};

const COUNTRY_CODES = new Set(Object.values(CONTINENT_MAPPING).flat());

// Common alternative names for countries to improve search (moved outside component for stability)
const COUNTRY_ALIASES: { [key: string]: string[] } = {
  USA: ["america", "united states", "us", "usa"],
  GBR: ["uk", "britain", "england", "united kingdom"],
  CHN: ["china", "prc"],
  DEU: ["germany", "deutschland"],
  JPN: ["japan", "nippon"],
  FRA: ["france"],
  IND: ["india", "bharat"],
  BRA: ["brazil", "brasil"],
  RUS: ["russia"],
  KOR: ["south korea", "korea"],
  ARE: ["uae", "emirates", "dubai"],
  SAU: ["saudi", "saudi arabia", "ksa"],
  ZAF: ["south africa", "sa"],
  NLD: ["netherlands", "holland"],
  CHE: ["switzerland", "swiss"],
  ESP: ["spain", "espana"],
  MEX: ["mexico"],
  IDN: ["indonesia"],
  TUR: ["turkey", "turkiye"],
  POL: ["poland", "polska"],
  SWE: ["sweden", "sverige"],
  NGA: ["nigeria"],
  EGY: ["egypt", "misr"],
  PAK: ["pakistan"],
  BGD: ["bangladesh"],
  VNM: ["vietnam"],
  PHL: ["philippines"],
  THA: ["thailand"],
  MYS: ["malaysia"],
  SGP: ["singapore"],
  HKG: ["hong kong"],
  TWN: ["taiwan"],
  NZL: ["new zealand", "nz"],
  AUS: ["australia", "aussie"],
  CAN: ["canada"],
  ARG: ["argentina"],
  COL: ["colombia"],
  CHL: ["chile"],
  PER: ["peru"],
  VEN: ["venezuela"],
  UKR: ["ukraine"],
  NOR: ["norway", "norge"],
  DNK: ["denmark", "danmark"],
  FIN: ["finland", "suomi"],
  IRL: ["ireland", "eire"],
  AUT: ["austria", "osterreich"],
  BEL: ["belgium", "belgie"],
  PRT: ["portugal"],
  GRC: ["greece", "hellas"],
  CZE: ["czech", "czechia"],
  ROU: ["romania"],
  ISR: ["israel"],
  QAT: ["qatar"],
  KWT: ["kuwait"],
  OMN: ["oman"],
  BHR: ["bahrain"],
  JOR: ["jordan"],
  LBN: ["lebanon"],
  IRQ: ["iraq"],
  IRN: ["iran", "persia"],
  AFG: ["afghanistan"],
  KEN: ["kenya"],
  ETH: ["ethiopia"],
  GHA: ["ghana"],
  TZA: ["tanzania"],
  MAR: ["morocco"],
  DZA: ["algeria"],
};

export default function Countries() {
  const router = useRouter();
  const [economyData, setEconomyData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );

  // Sidebar menu items
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      ),
    },
    {
      name: "Countries",
      path: "/countries",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
    },
    {
      name: "Insights",
      path: "/insights",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
    },
    {
      name: "Docs",
      path: "/docs",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      name: "Reports",
      path: "/reports",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <path d="M12 18v-6M9 15l3 3 3-3" />
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ];

  const continents = ["All", "Africa", "Asia", "Europe", "Americas", "Oceania"];


  useEffect(() => {
    fetchEconomyData();
  }, []);

  const fetchEconomyData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/economy`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load country data");
      }

      setEconomyData(result.data);
    } catch (error) {
      console.error("Error fetching economy data:", error);
      setError(error instanceof Error ? error.message : "Unable to load country data");
    } finally {
      setLoading(false);
    }
  };

  const latestYear = useMemo(
    () => economyData.length ? Math.max(...economyData.map((item) => item.year)) : null,
    [economyData]
  );

  const latestCountries = useMemo(
    () => economyData
      .filter((item) => item.year === latestYear && COUNTRY_CODES.has(item.countryCode))
      .sort((a, b) => b.gdp - a.gdp),
    [economyData, latestYear]
  );

  const globalRanks = useMemo(
    () => new Map(latestCountries.map((country, index) => [country.countryCode, index + 1])),
    [latestCountries]
  );

  const totalGDP = useMemo(
    () => latestCountries.reduce((total, country) => total + country.gdp, 0),
    [latestCountries]
  );

  const continentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: latestCountries.length };
    Object.entries(CONTINENT_MAPPING).forEach(([continent, codes]) => {
      counts[continent] = latestCountries.filter((country) =>
        codes.includes(country.countryCode)
      ).length;
    });
    return counts;
  }, [latestCountries]);


  // Get unique countries with their latest data
  const countries = useMemo(() => {
    if (!latestCountries.length) return [];

    // Filter by search query
    const query = searchQuery.toLowerCase().trim();
    let filtered = latestCountries.filter((item) => {
      // Match by country name
      if (item.country.name.toLowerCase().includes(query)) return true;
      // Match by country code
      if (item.countryCode.toLowerCase().includes(query)) return true;
      // Match by common aliases/nicknames
      const aliases = COUNTRY_ALIASES[item.countryCode] || [];
      if (
        aliases.some((alias) => alias.includes(query) || query.includes(alias))
      )
        return true;
      return false;
    });

    // Filter by continent
    if (selectedContinent !== "All") {
      const continentCodes = CONTINENT_MAPPING[selectedContinent] || [];
      filtered = filtered.filter((item) =>
        continentCodes.includes(item.countryCode)
      );
    }

    // Sort by GDP descending
    return filtered;
  }, [latestCountries, searchQuery, selectedContinent]);

  const formatGDP = (gdp: number) => {
    if (gdp >= 1e12) return `$${(gdp / 1e12).toFixed(2)}T`;
    if (gdp >= 1e9) return `$${(gdp / 1e9).toFixed(2)}B`;
    if (gdp >= 1e6) return `$${(gdp / 1e6).toFixed(2)}M`;
    return `$${gdp.toLocaleString()}`;
  };

  // Get historical GDP data for a country
  const getCountryHistory = (countryCode: string) => {
    return economyData
      .filter((item) => item.countryCode === countryCode)
      .sort((a, b) => a.year - b.year);
  };

  // Get max GDP for scaling the chart
  const getMaxGDP = (data: CountryData[]) => {
    return Math.max(...data.map((d) => d.gdp));
  };

  return (
    <WorkspaceShell
      title="Country explorer"
      eyebrow="Global database"
      actions={<div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400" />PostgreSQL data</div>}
    >
    <div className="w-full">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-white font-semibold text-lg">Economy</span>
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search for..."
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 mb-3 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <span
                      className={isActive ? "text-blue-400" : "text-gray-500"}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">User</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="min-w-0">
        {/* Top Header */}
        <header className="hidden">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-5 sm:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                </svg>
              </div>
              <h1 className="text-base sm:text-lg font-semibold text-white">Country explorer</h1>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              PostgreSQL data
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="w-full">
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#151b32] via-[#111526] to-[#11111e] px-6 py-8 sm:px-9 sm:py-10 mb-6"
          >
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute right-32 -bottom-24 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300 mb-4">
                  Global economy database
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                  Explore economies around the world
                </h2>
                <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-slate-400">
                  Compare the latest GDP figures, discover regional leaders, and open any country for its historical trend.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: "Economies", value: latestCountries.length || "—" },
                  { label: "Data year", value: latestYear || "—" },
                  { label: "Combined GDP", value: totalGDP ? formatGDP(totalGDP) : "—" },
                ].map((stat) => (
                  <div key={stat.label} className="min-w-0 sm:min-w-28 rounded-2xl border border-white/5 bg-white/[0.04] px-3 py-3 sm:px-4 backdrop-blur-sm">
                    <p className="truncate text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">{stat.label}</p>
                    <p className="mt-1 truncate text-sm sm:text-lg font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Search and Filter Section */}
          <section className="rounded-2xl border border-gray-800/70 bg-[#11111e]/80 p-4 sm:p-5 mb-7 shadow-2xl shadow-black/10">
            {/* Large Search Bar */}
            <div className="relative mb-4">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by country name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b0b16] border border-gray-800 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Continent Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {continents.map((continent) => (
                <motion.button
                  key={continent}
                  onClick={() => setSelectedContinent(continent)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    selectedContinent === continent
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "bg-white/[0.03] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700"
                  }`}
                >
                  {continent}
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${selectedContinent === continent ? "bg-white/15 text-white" : "bg-black/20 text-gray-500"}`}>
                    {continentCounts[continent] || 0}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">{selectedContinent}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{countries.length} {countries.length === 1 ? "economy" : "economies"}</h3>
            </div>
            <p className="hidden sm:block text-xs text-gray-500">Sorted by GDP · Select a card for history</p>
          </div>

          {/* Countries Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-56 animate-pulse rounded-2xl border border-white/[0.06] bg-[#0d1320]" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10 text-red-400">!</div>
              <p className="text-white font-medium">Country data could not be loaded</p>
              <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">{error}</p>
              <button onClick={fetchEconomyData} className="mt-5 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors">Try again</button>
            </div>
          ) : countries.length === 0 ? (
            <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed border-gray-800 bg-white/[0.01]">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <p className="text-gray-400 text-lg">No countries found</p>
                <p className="text-gray-500 text-sm mt-1">
                  Try adjusting your search or filter
                </p>
                <button onClick={() => { setSearchQuery(""); setSelectedContinent("All"); }} className="mt-4 text-sm font-medium text-blue-400 hover:text-blue-300">Clear filters</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {countries.map((country, idx) => (
                <motion.button
                  type="button"
                  key={country.countryCode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCountry(country)}
                  className="group relative overflow-hidden bg-[#0d1320] border border-white/[0.07] rounded-2xl p-5 text-left cursor-pointer transition-colors hover:border-blue-500/40 hover:bg-[#111a2b] hover:shadow-xl hover:shadow-blue-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/0 to-transparent transition-all group-hover:via-blue-400/70" />
                  {/* Country Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-violet-500/10 flex items-center justify-center border border-blue-400/15 shadow-inner">
                      <span className="text-blue-300 font-bold text-xs tracking-wider">
                        {country.countryCode}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-100 transition-colors">
                        {country.country.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">Latest observation · {country.year}</p>
                    </div>
                    <svg className="w-4 h-4 mt-1 text-gray-700 transition-all group-hover:text-blue-400 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                  </div>

                  {/* GDP Info */}
                  <div>
                    <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-1">GDP · Current USD</p>
                    <p className="text-2xl font-semibold tracking-tight text-white">
                      {formatGDP(country.gdp)}
                    </p>
                  </div>

                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-800/80">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((country.gdp / (latestCountries[0]?.gdp || 1)) * 100, 2)}%` }}
                      transition={{ delay: Math.min(idx * 0.03, 0.5) + 0.2, duration: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    />
                  </div>

                  {/* Rank Badge */}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-gray-500">{totalGDP ? ((country.gdp / totalGDP) * 100).toFixed(1) : "0.0"}% of listed GDP</span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        (globalRanks.get(country.countryCode) || 999) <= 10
                          ? "bg-emerald-500/10 text-emerald-400"
                          : (globalRanks.get(country.countryCode) || 999) <= 50
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      Global #{globalRanks.get(country.countryCode)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Country Detail Modal with Graph */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCountry(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1320] border border-white/[0.08] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30">
                    <span className="text-blue-400 font-bold text-lg">
                      {selectedCountry.countryCode}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedCountry.country.name}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      GDP History Overview
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  title="Close modal"
                  className="p-2 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Current Stats */}
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm mb-1">Current GDP</p>
                  <p className="text-3xl font-bold text-white">
                    {formatGDP(selectedCountry.gdp)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Year: {selectedCountry.year}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm mb-1">Data Points</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {getCountryHistory(selectedCountry.countryCode).length}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Years of data</p>
                </div>
              </div>

              {/* GDP Chart */}
              <div className="p-6 pt-0">
                <div className="bg-gray-900/50 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                    GDP Over Time
                  </h3>

                  {/* Chart Container */}
                  <div className="relative h-64">
                    {(() => {
                      const history = getCountryHistory(
                        selectedCountry.countryCode
                      );
                      const maxGDP = getMaxGDP(history);
                      const minYear = history.length > 0 ? history[0].year : 0;
                      const maxYear =
                        history.length > 0
                          ? history[history.length - 1].year
                          : 0;

                      return (
                        <>
                          {/* Y-axis labels */}
                          <div className="absolute left-0 top-0 h-full w-16 flex flex-col justify-between text-xs text-gray-500 pr-2">
                            <span>{formatGDP(maxGDP)}</span>
                            <span>{formatGDP(maxGDP * 0.75)}</span>
                            <span>{formatGDP(maxGDP * 0.5)}</span>
                            <span>{formatGDP(maxGDP * 0.25)}</span>
                            <span>$0</span>
                          </div>

                          {/* Chart Area */}
                          <div className="ml-16 h-full relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className="border-t border-gray-800/50 w-full"
                                />
                              ))}
                            </div>

                            {/* Bars */}
                            <div className="absolute inset-0 flex items-end gap-1 pb-6">
                              {history.map((data, i) => {
                                const height = (data.gdp / maxGDP) * 100;
                                return (
                                  <motion.div
                                    key={data.year}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{
                                      delay: i * 0.05,
                                      duration: 0.4,
                                    }}
                                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm hover:from-blue-500 hover:to-blue-300 transition-colors group relative cursor-pointer"
                                    title={`${data.year}: ${formatGDP(
                                      data.gdp
                                    )}`}
                                  >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                      <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                                        <p className="text-white font-medium">
                                          {data.year}
                                        </p>
                                        <p className="text-blue-400">
                                          {formatGDP(data.gdp)}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2">
                              <span>{minYear}</span>
                              <span>{Math.round((minYear + maxYear) / 2)}</span>
                              <span>{maxYear}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="p-6 pt-0">
                <div className="bg-gray-900/50 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-800/50">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                      </svg>
                      Historical Data
                    </h3>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-900">
                        <tr className="text-left text-xs text-gray-500 border-b border-gray-800/50">
                          <th className="px-5 py-3 font-medium">Year</th>
                          <th className="px-5 py-3 font-medium">GDP</th>
                          <th className="px-5 py-3 font-medium">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCountryHistory(selectedCountry.countryCode)
                          .slice()
                          .reverse()
                          .map((data, i, arr) => {
                            const prevData = arr[i + 1];
                            const change = prevData
                              ? ((data.gdp - prevData.gdp) / prevData.gdp) * 100
                              : 0;
                            return (
                              <tr
                                key={data.year}
                                className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors"
                              >
                                <td className="px-5 py-3 text-sm text-white">
                                  {data.year}
                                </td>
                                <td className="px-5 py-3 text-sm text-gray-300">
                                  {formatGDP(data.gdp)}
                                </td>
                                <td className="px-5 py-3">
                                  {prevData ? (
                                    <span
                                      className={`text-sm font-medium ${
                                        change >= 0
                                          ? "text-green-400"
                                          : "text-red-400"
                                      }`}
                                    >
                                      {change >= 0 ? "+" : ""}
                                      {change.toFixed(2)}%
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-sm">
                                      —
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </WorkspaceShell>
  );
}
