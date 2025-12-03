import React from "react";

const sideBar = () => {
  return (
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
                <span className={isActive ? "text-blue-400" : "text-gray-500"}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default sideBar;
