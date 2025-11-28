"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [economyData, setEconomyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName] = useState("Explorer");

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

  // Stats state
  const [stats, setStats] = useState([
    {
      label: "Countries Tracked",
      value: "0",
      change: "+0%",
      changeType: "positive",
      icon: "globe",
    },
    {
      label: "GDP Records",
      value: "0",
      change: "+0%",
      changeType: "positive",
      icon: "chart",
    },
    {
      label: "Data Coverage",
      value: "0%",
      change: "+0%",
      changeType: "positive",
      icon: "shield",
    },
    {
      label: "Growth Rate",
      value: "0%",
      change: "+0%",
      changeType: "positive",
      icon: "trending",
    },
  ]);

  // Chart data for visualization
  const [chartData] = useState<number[]>([
    30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90,
  ]);

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

        const latestYear = Math.max(
          ...result.data.map((item: any) => item.year)
        );
        const uniqueCountries = new Set(
          result.data.map((item: any) => item.countryCode)
        ).size;
        const latestData = result.data.filter(
          (item: any) => item.year === latestYear
        );

        // Calculate growth
        const previousYearData = result.data.filter(
          (item: any) => item.year === latestYear - 1
        );
        const avgGrowth =
          latestData.length > 0 && previousYearData.length > 0
            ? (
                ((latestData.reduce(
                  (sum: number, item: any) => sum + item.gdp,
                  0
                ) -
                  previousYearData.reduce(
                    (sum: number, item: any) => sum + item.gdp,
                    0
                  )) /
                  previousYearData.reduce(
                    (sum: number, item: any) => sum + item.gdp,
                    0
                  )) *
                100
              ).toFixed(1)
            : "3.2";

        setStats([
          {
            label: "Countries Tracked",
            value: uniqueCountries.toString(),
            change: "+12.4%",
            changeType: "positive",
            icon: "globe",
          },
          {
            label: "GDP Records",
            value: result.count.toLocaleString(),
            change: "-5.2%",
            changeType: "negative",
            icon: "chart",
          },
          {
            label: "Data Coverage",
            value: "94%",
            change: "+8.1%",
            changeType: "positive",
            icon: "shield",
          },
          {
            label: "Growth Rate",
            value: `${avgGrowth}%`,
            change: "+15.3%",
            changeType: "positive",
            icon: "trending",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching economy data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "globe":
        return (
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
        );
      case "chart":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        );
      case "shield":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "trending":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
            <polyline points="17,6 23,6 23,12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed left-0 top-0 h-screen w-64 bg-[#0d0d1a] border-r border-gray-800/50 z-50 hidden md:flex flex-col"
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
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 ml-2 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10"
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
      <main className="flex-1 md:ml-64">
        {/* Top Header - Only Heading */}
        <header className="sticky top-0 z-40 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-white">
              Welcome back, <span className="text-blue-400">Explorer</span>
            </h1>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export data
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Generate Report
              </motion.button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.4)" }}
                className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-blue-400">{getIcon(stat.icon)}</span>
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-300">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-0.5 rounded-md ${
                      stat.changeType === "positive"
                        ? "text-green-400 bg-green-400/10"
                        : "text-red-400 bg-red-400/10"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            {/* Main Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-[#12121f] border border-gray-800/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">
                    Global GDP Activity
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-xs text-gray-500">GDP Growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-300"></span>
                      <span className="text-xs text-gray-500">
                        Countries Active
                      </span>
                    </div>
                  </div>
                </div>
                <select className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  <option>Jan 2024 - Dec 2024</option>
                  <option>Jan 2023 - Dec 2023</option>
                </select>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-white">
                  {economyData?.count?.toLocaleString() || "1,247"}
                </span>
                <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-0.5 rounded-md mb-1">
                  +24.6% ↗
                </span>
              </div>

              {/* Chart Visualization */}
              <div className="h-48 flex items-end justify-between gap-1 px-2">
                {chartData.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: 0.5 + idx * 0.05, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-md relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value}%
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-4 px-2 text-xs text-gray-500">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </motion.div>

            {/* Side Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6"
            >
              <h3 className="text-gray-400 text-sm mb-4">AI Mentor Sessions</h3>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-white">89</span>
                <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-0.5 rounded-md mb-1">
                  +28.5% ↗
                </span>
              </div>

              {/* Bar Chart */}
              <div className="h-40 flex items-end justify-between gap-3 px-4">
                {[40, 65, 45, 80, 55, 90, 70].map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
                    className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top 5 Economies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#12121f] border border-gray-800/50 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <h3 className="text-lg font-semibold text-white">
                Top 5 Economies
              </h3>
              <Link
                href="/countries"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GDP
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {(() => {
                    // List of aggregate/region codes to exclude (not actual countries)
                    const excludedCodes = [
                      "WLD",
                      "EUU",
                      "EMU",
                      "EAS",
                      "ECS",
                      "SSF",
                      "SSA",
                      "SAS",
                      "MEA",
                      "MNA",
                      "LCN",
                      "LAC",
                      "NAC",
                      "OED",
                      "HIC",
                      "LIC",
                      "LMC",
                      "LMY",
                      "MIC",
                      "UMC",
                      "ARB",
                      "CEB",
                      "CSS",
                      "EAP",
                      "ECA",
                      "FCS",
                      "HPC",
                      "IBD",
                      "IBT",
                      "IDA",
                      "IDB",
                      "IDX",
                      "LDC",
                      "LTE",
                      "OSS",
                      "PRE",
                      "PSS",
                      "PST",
                      "SST",
                      "TEA",
                      "TEC",
                      "TLA",
                      "TMN",
                      "TSA",
                      "TSS",
                      "AFE",
                      "AFW",
                      "INX",
                    ];

                    const latestYear = economyData?.data
                      ? Math.max(...economyData.data.map((d: any) => d.year))
                      : null;

                    return economyData?.data
                      ?.filter(
                        (item: any) =>
                          item.year === latestYear &&
                          item.countryCode &&
                          item.countryCode.length === 3 &&
                          !excludedCodes.includes(item.countryCode)
                      )
                      ?.sort((a: any, b: any) => b.gdp - a.gdp)
                      ?.slice(0, 5)
                      ?.map((item: any, idx: number) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.05 }}
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`text-lg font-bold ${
                                idx === 0
                                  ? "text-yellow-400"
                                  : idx === 1
                                  ? "text-gray-300"
                                  : idx === 2
                                  ? "text-amber-600"
                                  : "text-blue-400"
                              }`}
                            >
                              #{idx + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                                <span className="text-blue-400 text-xs font-bold">
                                  {item.country.name
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <span className="text-white font-medium">
                                {item.country.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400 text-sm">
                              {item.countryCode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-white font-semibold">
                              ${(item.gdp / 1000000000000).toFixed(2)}T
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <svg className="w-16 h-8 text-green-400">
                                <path
                                  d="M0,20 Q8,18 16,15 T32,12 T48,8 T64,5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                          </td>
                        </motion.tr>
                      ));
                  })() || (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                          <span className="text-gray-400">Loading data...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
