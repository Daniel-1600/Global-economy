"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();
  // Variants for animations
  useEffect(() => {
    // Cleanup for any async effects
    return () => {};
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden pt-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1 */}
        <motion.div
          className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"
          style={{
            top: "10%",
            left: "5%",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Orb 2 */}
        <motion.div
          className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-15"
          style={{
            bottom: "10%",
            right: "5%",
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-5xl"
          // variants={containerVariants}
          // initial="hidden"
          // animate="visible"
        >
          {/* Badge */}
          <motion.div
            // variants={itemVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.2,
            }}
            className="flex justify-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-400">
                Powered by Real Data & AI Insights
              </span>
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            // variants={itemVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.3,
            }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-6 text-white leading-tight"
          >
            Global Economy
            <br />
            <span className="text-3xl sm:text-4xl md:text-6xl text-blue-500">
              At Your Fingertips
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            // variants={itemVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.4,
            }}
            className="text-center text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Explore, visualize, and analyze world economic data with AI-powered
            insights. Make informed decisions with real-time analytics and
            predictive intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            // variants={itemVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.5,
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <motion.button
              onClick={() => router.push("/dashboard")}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Go to dashboard
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Dashboard Screenshot - Positioned like reference image */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 50,
              delay: 0.6,
            }}
            className="relative mt-8 mb-20"
          >
            {/* Screenshot Container with perspective */}
            <div
              className="relative mx-auto max-w-6xl"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                initial={{ rotateX: 10 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Glow behind */}
                <div className="absolute -inset-4 bg-gradient-to-t from-blue-600/30 via-blue-500/10 to-transparent blur-2xl rounded-3xl"></div>

                {/* Main Screenshot Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl shadow-black/50 bg-[#0d0d1a]">
                  {/* Browser Chrome */}
                  <div className="bg-[#12121f] px-4 py-3 flex items-center gap-3 border-b border-gray-800/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex-1 mx-4 bg-gray-800/50 rounded-lg px-4 py-1.5 text-xs text-gray-500 flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      economy-explorer.com/dashboard
                    </div>
                  </div>

                  {/* Screenshot Image */}
                  <div className="relative">
                    <Image
                      src="/dashboard.png"
                      alt="Economy Explorer Dashboard"
                      width={1920}
                      height={1080}
                      className="w-full h-auto"
                      priority
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center h-[500px] bg-gradient-to-br from-[#0d0d1a] to-[#12121f]">
                              <div class="text-center">
                                <div class="text-6xl mb-4">📊</div>
                                <p class="text-gray-400 text-lg">Dashboard Preview</p>
                                <p class="text-blue-400/60 text-sm mt-2">Save your screenshot as dashboard.png in public folder</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />

                    {/* Right side shading/blur effect */}
                    <div className="absolute top-1/2 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[#0a0a1a] via-[#0a0a1a]/70 to-transparent pointer-events-none"></div>

                    {/* Right side blur overlay - lower part only */}
                    <div className="absolute top-1/2 right-0 bottom-0 w-1/3 backdrop-blur-[2px] bg-gradient-to-l from-blue-900/30 via-blue-900/15 to-transparent pointer-events-none"></div>

                    {/* Gradient overlay at bottom for fade effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent pointer-events-none"></div>

                    {/* Corner blend (bottom-right) - stronger */}
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#0a0a1a] via-[#0a0a1a]/60 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            id="how-it-works"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.7,
            }}
            className="mt-32 mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How It <span className="text-blue-500">Works</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Get started with Economy Explorer in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  delay: 0.8,
                }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-blue-500">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Sign Up & Explore
                  </h3>
                  <p className="text-gray-400">
                    Create your free account and gain instant access to our
                    comprehensive economic database covering 195+ countries.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  delay: 0.9,
                }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-blue-500">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Visualize Data
                  </h3>
                  <p className="text-gray-400">
                    Use our interactive dashboards and charts to visualize
                    economic trends, GDP growth, and market indicators in
                    real-time.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  delay: 1.0,
                }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-blue-500">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Get AI Insights
                  </h3>
                  <p className="text-gray-400">
                    Leverage our AI-powered analysis to get predictive insights,
                    trend forecasts, and data-driven recommendations.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Additional Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                delay: 1.1,
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-gray-900/50 border border-blue-500/10 rounded-xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Real-Time Updates
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Our system continuously fetches and processes the latest
                    economic data to keep you informed.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-blue-500/10 rounded-xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18M3 9h18M3 15h18M15 3v18" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Custom Analytics
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Create custom reports and export data for your specific
                    analysis needs.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            id="features"
            // variants={containerVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.6,
            }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: (
                  <svg
                    className="w-16 h-16"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="8"
                      y="12"
                      width="48"
                      height="44"
                      rx="4"
                      fill="#3B82F6"
                      fillOpacity="0.2"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                    <rect
                      x="16"
                      y="32"
                      width="8"
                      height="16"
                      rx="2"
                      fill="#3B82F6"
                    />
                    <rect
                      x="28"
                      y="24"
                      width="8"
                      height="24"
                      rx="2"
                      fill="#60A5FA"
                    />
                    <rect
                      x="40"
                      y="16"
                      width="8"
                      height="32"
                      rx="2"
                      fill="#93C5FD"
                    />
                  </svg>
                ),
                title: "Real-Time Data",
                description:
                  "Access live economic indicators and market trends",
              },
              {
                icon: (
                  <svg
                    className="w-16 h-16"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="32"
                      cy="28"
                      r="16"
                      fill="#3B82F6"
                      fillOpacity="0.2"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                    <circle cx="26" cy="26" r="3" fill="#60A5FA" />
                    <circle cx="38" cy="26" r="3" fill="#60A5FA" />
                    <path
                      d="M24 34 Q32 38 40 34"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <rect
                      x="22"
                      y="16"
                      width="4"
                      height="6"
                      rx="2"
                      fill="#3B82F6"
                    />
                    <rect
                      x="38"
                      y="16"
                      width="4"
                      height="6"
                      rx="2"
                      fill="#3B82F6"
                    />
                    <path
                      d="M16 44 L32 52 L48 44"
                      stroke="#60A5FA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "AI Insights",
                description:
                  "Get intelligent predictions and analysis powered by ML",
              },
              {
                icon: (
                  <svg
                    className="w-16 h-16"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="20"
                      fill="#3B82F6"
                      fillOpacity="0.2"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx="32"
                      cy="32"
                      rx="8"
                      ry="20"
                      stroke="#60A5FA"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="12"
                      y1="32"
                      x2="52"
                      y2="32"
                      stroke="#60A5FA"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M20 20 Q32 18 44 20"
                      stroke="#60A5FA"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M20 44 Q32 46 44 44"
                      stroke="#60A5FA"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle cx="32" cy="32" r="3" fill="#3B82F6" />
                  </svg>
                ),
                title: "Global Coverage",
                description: "Explore economies from 195+ countries worldwide",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                // variants={itemVariants}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  delay: 0.7,
                }}
                whileHover={{ y: -10, borderColor: "rgba(59, 130, 246, 0.8)" }}
                className="p-6 rounded-xl bg-gray-900/50 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/60 transition-all text-center"
              >
                <div className="mb-4 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            // variants={containerVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              delay: 0.8,
            }}
            className="flex flex-col sm:flex-row justify-around gap-8 pt-8 border-t border-blue-500/30"
          >
            {[
              { value: "195+", label: "Countries" },
              { value: "1M+", label: "Data Points" },
              { value: "24/7", label: "Real-Time" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                // variants={itemVariants
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  delay: 0.9,
                }}
                className="text-center"
              >
                <motion.div
                  className="text-3xl font-bold text-blue-500 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: idx * 0.3,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      ></motion.div>
    </div>
  );
}
