"use client";

import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "@/components/footer";
import Sidebar from "@/components/Sidebar";

const Countrydata = () => {
  const [countryCode, setCountryCode] = useState("");
  const [countryData, setCountryData] = useState<{
    gdpData: unknown;
    popData: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchCountryData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCountryData(null);

    try {
      const response = await fetch("http://localhost:5000/api/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ countryCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch country data");
      }

      const data = await response.json();
      setCountryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Sidebar />

      {/* Main Content with margin for sidebar */}
      <div className="md:ml-64">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <div className="bg-gray-900/50 backdrop-blur border border-blue-500/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              Search Country Data
            </h2>
            <form
              onSubmit={handleFetchCountryData}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                placeholder="Enter country code (e.g., USA, IND, CHN)"
                className="flex-1 px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                maxLength={3}
              />
              <motion.button
                type="submit"
                disabled={loading || !countryCode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Loading..." : "Search"}
              </motion.button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
              >
                {error}
              </motion.div>
            )}

            {countryData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-4">
                  Economic Data for {countryCode}
                </h3>

                {/* GDP Chart */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-blue-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">💰</span>
                    <h3 className="text-lg font-semibold text-blue-400">
                      GDP (Current US$) - Historical Trend
                    </h3>
                  </div>

                  {Array.isArray(countryData.gdpData) &&
                  countryData.gdpData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={(
                          countryData.gdpData as Array<{
                            date: string;
                            value: number;
                          }>
                        )
                          .filter((item) => item.value !== null)
                          .reverse()
                          .slice(0, 15)}
                      >
                        <defs>
                          <linearGradient
                            id="gdpGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3B82F6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3B82F6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          stroke="#6b7280"
                          style={{ fontSize: "12px" }}
                          tickFormatter={(value) =>
                            `$${(value / 1000000000000).toFixed(1)}T`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #3B82F6",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                          formatter={(value: number) => [
                            `$${(value / 1000000000000).toFixed(2)} Trillion`,
                            "GDP",
                          ]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          fillOpacity={1}
                          fill="url(#gdpGradient)"
                          name="GDP"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No GDP data available
                    </p>
                  )}
                </div>

                {/* Population Chart */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">👥</span>
                    <h3 className="text-lg font-semibold text-blue-400">
                      Population - Historical Trend
                    </h3>
                  </div>

                  {Array.isArray(countryData.popData) &&
                  countryData.popData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={(
                          countryData.popData as Array<{
                            date: string;
                            value: number;
                          }>
                        )
                          .filter((item) => item.value !== null)
                          .reverse()
                          .slice(0, 15)}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis
                          stroke="#6b7280"
                          style={{ fontSize: "12px" }}
                          tickFormatter={(value) =>
                            `${(value / 1000000).toFixed(0)}M`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #3B82F6",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                          formatter={(value: number) => [
                            `${(value / 1000000).toFixed(2)} Million`,
                            "Population",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Population"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No population data available
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <Footer />
      </div>
    </div>
  );
};

export default Countrydata;
