'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState('Global');

  const regions = ['Global', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  const metrics = [
    { label: 'GDP Growth', value: '3.2%', change: '+0.5%', icon: '📈' },
    { label: 'Inflation Rate', value: '4.1%', change: '-0.3%', icon: '💹' },
    { label: 'Unemployment', value: '5.8%', change: '+0.2%', icon: '👥' },
    { label: 'Trade Volume', value: '$28.5T', change: '+2.1%', icon: '🌍' },
  ];

  const topCountries = [
    { name: 'United States', gdp: '$27.5T', growth: '+2.8%' },
    { name: 'China', gdp: '$17.9T', growth: '+3.1%' },
    { name: 'Germany', gdp: '$4.3T', growth: '+0.5%' },
    { name: 'Japan', gdp: '$4.2T', growth: '+1.2%' },
    { name: 'India', gdp: '$3.9T', growth: '+6.8%' },
    { name: 'United Kingdom', gdp: '$3.3T', growth: '+0.9%' },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-32 pb-16">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent mb-2">
          Global Economy Dashboard
        </h1>
        <p className="text-cyan-400/70">Real-time economic data & AI insights powered by latest indicators</p>
      </motion.div>

      {/* Region Selector */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="text-sm text-cyan-300/60 mb-4">Select Region</p>
        <div className="flex flex-wrap gap-3">
          {regions.map((region) => (
            <motion.button
              key={region}
              onClick={() => setSelectedRegion(region)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedRegion === region
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-cyan-500/20'
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
        <h2 className="text-xl font-semibold text-white mb-6">Key Economic Indicators - {selectedRegion}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, borderColor: 'rgba(34, 211, 238, 0.6)' }}
              className="bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">{metric.label}</p>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{metric.value}</h3>
              <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
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
        <h2 className="text-xl font-semibold text-white mb-6">Top Economies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topCountries.map((country, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 8 }}
              className="bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{country.name}</h3>
                  <p className="text-cyan-400 font-medium">{country.gdp}</p>
                </div>
                <div className={`text-right font-bold ${country.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
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
        <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🤖</span>
            <div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-3">AI Insights</h3>
              <p className="text-blue-200/70 leading-relaxed">
                Based on current trends, the global economy shows moderate growth with emerging markets leading. 
                {selectedRegion !== 'Global' && ` ${selectedRegion} is experiencing `}
                inflation stabilization and increased trade activity. Key opportunities exist in tech sectors 
                and sustainable energy transitions.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Placeholder */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Economic Trends</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-xl p-12 h-80 flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">📊</span>
          <p className="text-gray-400 text-lg">Interactive charts & visualizations coming soon</p>
          <p className="text-cyan-400/60 text-sm mt-2">Charts will display real-time economic trends</p>
        </div>
      </motion.div>
    </div>
  );
}
