"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

interface UserLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
  ip: string;
}

export default function Settings() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  // User preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    darkMode: true,
    compactView: false,
    currency: "USD",
    language: "English",
  });

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

  const settingsTabs = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "billing", label: "Billing", icon: "💳" },
  ];

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      setLoading(true);
      // Using ip-api for location detection
      const response = await fetch("http://ip-api.com/json/");
      const data = await response.json();

      if (data.status === "success") {
        setUserLocation({
          country: data.country,
          countryCode: data.countryCode,
          city: data.city,
          region: data.regionName,
          timezone: data.timezone,
          ip: data.query,
        });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      // Fallback data
      setUserLocation({
        country: "Unknown",
        countryCode: "XX",
        city: "Unknown",
        region: "Unknown",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ip: "Hidden",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode || countryCode === "XX") return "🌍";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
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
              placeholder="Search settings..."
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
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
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
      <main className="flex-1 md:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-white">
              <span className="text-blue-400">Settings</span>
            </h1>
            <div className="flex items-center gap-3">
              {userLocation && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="text-xl">
                    {getCountryFlag(userLocation.countryCode)}
                  </span>
                  {userLocation.city}, {userLocation.country}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Settings Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {settingsTabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-[#12121f] text-gray-400 hover:text-white border border-gray-800/50 hover:border-gray-700"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Profile Information
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
                      <span className="text-white font-bold text-3xl">U</span>
                    </div>
                    <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                      Change Avatar
                    </button>
                  </div>

                  {/* Profile Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Economy Explorer"
                        className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="user@example.com"
                        className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue="@explorer"
                        className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Location Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📍</span> Location Information
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : userLocation ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Country</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <span className="text-2xl">
                          {getCountryFlag(userLocation.countryCode)}
                        </span>
                        {userLocation.country}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">City</p>
                      <p className="text-white font-medium">
                        {userLocation.city}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Region</p>
                      <p className="text-white font-medium">
                        {userLocation.region}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Timezone</p>
                      <p className="text-white font-medium">
                        {userLocation.timezone}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">Country Code</p>
                      <p className="text-white font-medium">
                        {userLocation.countryCode}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-gray-500 text-sm mb-1">IP Address</p>
                      <p className="text-white font-medium font-mono text-sm">
                        {userLocation.ip}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Unable to detect location</p>
                )}
              </motion.div>

              {/* Account Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Account Statistics
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-400">156</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Countries Viewed
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-400">42</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Reports Generated
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-purple-400">89</p>
                    <p className="text-gray-400 text-sm mt-1">Searches Made</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-orange-400">7</p>
                    <p className="text-gray-400 text-sm mt-1">Days Active</p>
                  </div>
                </div>
              </motion.div>

              {/* Save Button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                Display Preferences
              </h2>

              <div className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-gray-500 text-sm">
                      Use dark theme across the application
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("darkMode")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.darkMode ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        preferences.darkMode
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Compact View */}
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div>
                    <p className="text-white font-medium">Compact View</p>
                    <p className="text-gray-500 text-sm">
                      Show more data in less space
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("compactView")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.compactView ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        preferences.compactView
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Currency */}
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div>
                    <p className="text-white font-medium">Default Currency</p>
                    <p className="text-gray-500 text-sm">
                      Currency for displaying economic data
                    </p>
                  </div>
                  <select
                    value={preferences.currency}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        currency: e.target.value,
                      })
                    }
                    className="bg-gray-900/50 border border-gray-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                  </select>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Language</p>
                    <p className="text-gray-500 text-sm">
                      Select your preferred language
                    </p>
                  </div>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        language: e.target.value,
                      })
                    }
                    className="bg-gray-900/50 border border-gray-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                    <option value="Chinese">中文</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                Notification Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div>
                    <p className="text-white font-medium">
                      Email Notifications
                    </p>
                    <p className="text-gray-500 text-sm">
                      Receive updates via email
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("emailNotifications")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.emailNotifications
                        ? "bg-blue-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        preferences.emailNotifications
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-gray-500 text-sm">
                      Receive browser notifications
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("pushNotifications")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.pushNotifications
                        ? "bg-blue-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        preferences.pushNotifications
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Weekly Digest</p>
                    <p className="text-gray-500 text-sm">
                      Get a weekly summary of economic updates
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("weeklyDigest")}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences.weeklyDigest ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        preferences.weeklyDigest
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">
                  Change Password
                </h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors mt-2">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Two-Factor Authentication
                </h2>
                <p className="text-gray-400 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  Enable 2FA
                </button>
              </div>

              <div className="bg-[#12121f] border border-red-500/20 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-red-400 mb-4">
                  Danger Zone
                </h2>
                <p className="text-gray-400 mb-4">
                  Once you delete your account, there is no going back.
                </p>
                <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">
                  Current Plan
                </h2>

                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Free Plan
                      </h3>
                      <p className="text-gray-400">
                        Basic access to economy data
                      </p>
                    </div>
                    <span className="text-3xl font-bold text-white">
                      $0<span className="text-gray-500 text-lg">/mo</span>
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Access to 50 countries
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Basic charts & graphs
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      5 reports per month
                    </li>
                  </ul>
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition-colors">
                    Upgrade to Pro
                  </button>
                </div>
              </div>

              <div className="bg-[#12121f] border border-gray-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Payment Method
                </h2>
                <p className="text-gray-400 mb-4">No payment method on file</p>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  Add Payment Method
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
