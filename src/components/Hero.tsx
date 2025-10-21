"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  // Variants for animations
  useEffect(() => {
    // Cleanup for any async effects
    return () => {};
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden pt-32">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1 */}
        <motion.div
          className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"
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
          className="absolute w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-20"
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm font-medium text-cyan-300">
                Powered by Real Data & AI Insights
              </span>
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400 bg-clip-text text-transparent leading-tight"
          >
            Global Economy
            <br />
            <span className="text-3xl sm:text-4xl md:text-6xl">
              At Your Fingertips
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-center text-lg sm:text-xl text-blue-200/70 mb-8 max-w-2xl mx-auto"
          >
            Explore, visualize, and analyze world economic data with AI-powered
            insights. Make informed decisions with real-time analytics and
            predictive intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              onClick={() => router.push("/dashboard")}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            >
              Explore Dashboard
            </motion.button>
            <motion.button
              onClick={() => {
                const element = document.getElementById("features");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.05, borderColor: "rgba(34, 211, 238, 1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-cyan-500/50 text-cyan-300 font-bold rounded-lg hover:border-cyan-500 transition-colors backdrop-blur-sm cursor-pointer"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            id="features"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: "📊",
                title: "Real-Time Data",
                description:
                  "Access live economic indicators and market trends",
              },
              {
                icon: "🤖",
                title: "AI Insights",
                description:
                  "Get intelligent predictions and analysis powered by ML",
              },
              {
                icon: "🌍",
                title: "Global Coverage",
                description: "Explore economies from 195+ countries worldwide",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10, borderColor: "rgba(34, 211, 238, 0.8)" }}
                className="p-6 rounded-xl bg-slate-800/50 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/60 transition-all"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-blue-200/60">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col sm:flex-row justify-around gap-8 pt-8 border-t border-cyan-500/20"
          >
            {[
              { value: "195+", label: "Countries" },
              { value: "1M+", label: "Data Points" },
              { value: "24/7", label: "Real-Time" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  className="text-3xl font-bold text-cyan-400 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: idx * 0.3,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-blue-200/60">{stat.label}</div>
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
      >
        <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex items-center justify-center">
          <motion.div
            className="w-1 h-2 bg-cyan-500 rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}
