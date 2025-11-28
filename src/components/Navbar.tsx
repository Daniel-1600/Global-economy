"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Analytics", href: "/analytics" },
    { name: "Countries", href: "/countries" },
    { name: "Insights", href: "/insights" },
    { name: "Docs", href: "/docs" },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-blue-500/30 shadow-lg shadow-blue-500/10"
          : "bg-black/90 backdrop-blur-md border-b border-blue-500/10"
      }`}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-lg blur  opacity-60"></div>
                <div className="relative px-3 py-2 bg-black rounded-lg border border-blue-500/30">
                  <span className="text-xl font-bold text-blue-500">E</span>
                </div>
              </div>
              <span className="hidden sm:inline-block text-lg font-bold text-blue-500">
                Economy Explorer
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center gap-1"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors group"
                >
                  {item.name}
                  <motion.div
                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: "left" }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-gray-300 border border-blue-500/50 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/50 rounded-lg border border-blue-500/10 mt-2">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                onClick={() => setIsOpen(false)}
              >
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-blue-500/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 text-sm font-medium text-gray-300 border border-blue-500/50 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
