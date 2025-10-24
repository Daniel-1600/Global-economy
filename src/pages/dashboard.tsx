"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [economyData, setEconomyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    { label: "GDP Growth", value: "Loading...", change: "+0.0%", icon: "📈" },
    {
      label: "Total Countries",
      value: "Loading...",
      change: "+0.0%",
      icon: "🌍",
    },
    { label: "Latest Year", value: "Loading...", change: "+0.0%", icon: "📅" },
    { label: "Data Points", value: "Loading...", change: "+0.0%", icon: "💹" },
  ]);

  const regions = ["Global", "Asia", "Europe", "Americas", "Africa", "Oceania"];

  useEffect(() => {
    fetchEconomyData();
  }, []);

  const fetchEconomyData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/economy");
      const result = await response.json();

      if (result.success) {
        setEconomyData(result);

        // Calculate metrics from the data
        const latestYear = Math.max(
          ...result.data.map((item: any) => item.year)
        );
        const uniqueCountries = new Set(
          result.data.map((item: any) => item.countryCode)
        ).size;

        // Get latest GDP for top countries
        const latestData = result.data.filter(
          (item: any) => item.year === latestYear
        );
        const topCountry = latestData.reduce(
          (max: any, item: any) => (item.gdp > (max?.gdp || 0) ? item : max),
          null
        );

        setMetrics([
          {
            label: "Top GDP",
            value: topCountry
              ? `$${(topCountry.gdp / 1000000000000).toFixed(1)}T`
              : "N/A",
            change: topCountry ? topCountry.country.name : "",
            icon: "📈",
          },
          {
            label: "Total Countries",
            value: uniqueCountries.toString(),
            change: "Worldwide",
            icon: "🌍",
          },
          {
            label: "Latest Year",
            value: latestYear.toString(),
            change: "Most Recent",
            icon: "�",
          },
          {
            label: "Data Points",
            value: result.count.toLocaleString(),
            change: "Historical",
            icon: "💹",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching economy data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [topCountries, setTopCountries] = useState([
    { name: "Loading...", gdp: "$0.0T", growth: "+0.0%" },
  ]);

  useEffect(() => {
    if (economyData?.data) {
      // Get latest year data
      const latestYear = Math.max(
        ...economyData.data.map((item: { year: number }) => item.year)
      );
      const currentYearData = economyData.data.filter(
        (item: { year: number }) => item.year === latestYear
      );
      const previousYearData = economyData.data.filter(
        (item: { year: number }) => item.year === latestYear - 1
      );

      // Sort by GDP and get top 6
      const top6 = currentYearData
        .sort((a: { gdp: number }, b: { gdp: number }) => b.gdp - a.gdp)
        .slice(0, 6)
        .map(
          (current: {
            country: { name: string };
            countryCode: string;
            gdp: number;
          }) => {
            const previous = previousYearData.find(
              (p: { countryCode: string }) =>
                p.countryCode === current.countryCode
            );
            const growth = previous
              ? (((current.gdp - previous.gdp) / previous.gdp) * 100).toFixed(1)
              : "0.0";

            return {
              name: current.country.name,
              gdp: `$${(current.gdp / 1000000000000).toFixed(1)}T`,
              growth: `${parseFloat(growth) >= 0 ? "+" : ""}${growth}%`,
            };
          }
        );

      setTopCountries(top6);
    }
  }, [economyData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-16 text-center">
      <Sidebar />

      {/* Main Content with margin for sidebar */}
      <div className="md:ml-64">
        {/* Header */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Global Economy <span className="text-blue-500">Dashboard</span>
          </h1>
          <p className="text-gray-400">
            Real-time economic data & AI insights powered by latest indicators
          </p>
        </motion.div>

        {/* Country Search Form */}

        {/* Region Selector */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-sm text-gray-400 mb-4">Select Region</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {regions.map((region) => (
              <motion.button
                key={region}
                onClick={() => setSelectedRegion(region)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedRegion === region
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-blue-500/20"
                }`}
              >
                {region}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Key Economic Indicators - {selectedRegion}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, borderColor: "rgba(59, 130, 246, 0.6)" }}
                className="bg-gray-900/50 backdrop-blur border border-blue-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {metric.value}
                </h3>
                <span
                  className={`text-sm font-medium ${
                    metric.change.startsWith("+")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {metric.change}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Countries */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Top Economies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topCountries.map((country, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 8 }}
                className="bg-gray-900/50 backdrop-blur border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/60 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {country.name}
                    </h3>
                    <p className="text-blue-400 font-medium">{country.gdp}</p>
                  </div>
                  <div
                    className={`text-right font-bold ${
                      country.growth.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {country.growth}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights Section */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🤖</span>
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-3">
                  AI Insights
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Based on current trends, the global economy shows moderate
                  growth with emerging markets leading.
                  {selectedRegion !== "Global" &&
                    ` ${selectedRegion} is experiencing `}
                  inflation stabilization and increased trade activity. Key
                  opportunities exist in tech sectors and sustainable energy
                  transitions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Countries Data Table */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              All Economic Data ({economyData?.count || 0} records)
            </h2>
            {loading && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-sm">Loading data...</span>
              </div>
            )}
          </div>

          <div className="bg-gray-900/50 backdrop-blur border border-blue-500/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-800/80 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-blue-400 uppercase tracking-wider">
                      GDP (USD)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                      Indicator
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {economyData?.data && economyData.data.length > 0 ? (
                    economyData.data.map(
                      (
                        item: {
                          country: { name: string; id: string };
                          countryCode: string;
                          year: number;
                          gdp: number;
                          indicator: { name: string };
                        },
                        idx: number
                      ) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: Math.min(idx * 0.01, 0.5) }}
                          className="hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {item.country.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">
                              {item.countryCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">
                              {item.year}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-blue-400">
                              ${(item.gdp / 1000000000000).toFixed(2)}T
                            </div>
                            <div className="text-xs text-gray-500">
                              ${(item.gdp / 1000000000).toFixed(0)}B
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {item.indicator.name}
                            </div>
                          </td>
                        </motion.tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-4xl mb-4">📊</span>
                          <p className="text-gray-400">
                            {loading ? "Loading data..." : "No data available"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Summary */}
          {economyData?.metadata && (
            <div className="mt-4 p-4 bg-gray-900/30 border border-blue-500/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Source: </span>
                  <span className="text-blue-400">
                    {economyData.metadata.source}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Indicator: </span>
                  <span className="text-white">
                    {economyData.metadata.indicator}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Updated: </span>
                  <span className="text-gray-300">
                    {new Date(
                      economyData.metadata.lastUpdated
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <Footer />
      </div>
    </div>
  );
}
