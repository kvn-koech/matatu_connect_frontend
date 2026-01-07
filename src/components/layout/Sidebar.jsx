import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex-shrink-0">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        {role === "driver" && (
          <li>
            <Link to="/driver-dashboard">Driver Dashboard</Link>
          </li>
        )}
        {role === "commuter" && (
          <li>
            <Link to="/commuter-dashboard">Commuter Dashboard</Link>
          </li>
        )}
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
