"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
    {
      name: "Country Data",
      path: "/countryData",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="4"
            ry="9"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M7 6 Q12 5 17 6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M7 18 Q12 19 17 18"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      ),
    },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gray-900/50 backdrop-blur-xl border-r border-blue-500/20 z-40 hidden md:block"
    >
      <nav className="flex flex-col h-full py-8 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileHover={{
                    x: 8,
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-500/20 text-blue-400 border-l-4 border-blue-500"
                      : "text-gray-400 hover:text-blue-400"
                  }`}
                >
                  <span
                    className={isActive ? "text-blue-400" : "text-gray-400"}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom section */}
        <div className="mt-auto">
          <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Quick Tip</p>
            <p className="text-sm text-blue-400">
              Use country codes like USA, IND, CHN
            </p>
          </div>
        </div>
      </nav>
    </motion.aside>
  );
}
