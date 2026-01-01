import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const driverLinks = [
    { path: "/driver", label: "Dashboard" },
    { path: "/driver/routes", label: "Routes" },
    { path: "/driver/bookings", label: "Bookings" },
    { path: "/driver/earnings", label: "Earnings" },
  ];

  const commuterLinks = [
    { path: "/commuter", label: "Dashboard" },
    { path: "/commuter/book", label: "Book Ride" },
    { path: "/commuter/history", label: "Trip History" },
  ];

  const links = role === "driver" ? driverLinks : commuterLinks;

  return (
    <aside
      className={`bg-gray-900 text-white h-screen transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={toggleCollapse}
        className="w-full p-3 border-b border-gray-700 hover:bg-gray-800 text-left"
      >
        {collapsed ? "➡" : "⬅ Collapse"}
      </button>

      {/* Links */}
      <nav className="mt-4 flex-1 flex flex-col">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 my-1 rounded transition-colors ${
                isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-800"
              }`
            }
            title={collapsed ? link.label : ""}
          >
            <span className="text-sm">{collapsed ? link.label.charAt(0) : link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 text-xs text-gray-400 border-t border-gray-700">
        {!collapsed && "Matatu Connect"}
      </div>
    </aside>
  );
};

export default Sidebar;
