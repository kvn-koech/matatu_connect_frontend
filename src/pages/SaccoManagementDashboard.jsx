import React, { useState } from "react";
import LiveMap from "../components/map/LiveMap";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { fetchMatatus } from "../api/matatus";
import { fetchRoutes } from "../api/routes";
import { fetchDrivers } from "../api/users";
import RevenueChart from "../components/charts/RevenueChart";

export default function SaccoManagementDashboard() {
  const { user, logout } = useAuth();

  // Data States
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [mapVehicles, setMapVehicles] = useState([]);

  // Fetch Data
  const loadData = async () => {
    try {
      // Fetch Drivers for quick view
      const resDrivers = await fetchDrivers();
      const driverData = Array.isArray(resDrivers.data) ? resDrivers.data : (resDrivers.data.data || []);

      // Filter only active drivers (optional, but good for dashboard)
      setAvailableDrivers(driverData);

      // Fetch Vehicles for Map
      const resVehicles = await fetchMatatus();
      const vehicleList = resVehicles.data?.data || resVehicles.data || [];

      // Generate Mock Coordinates for each real vehicle (around Nairobi)
      const mappedVehicles = vehicleList.map((v, index) => ({
        id: v.id,
        name: `${v.plate_number} (${v.route?.name || "Unassigned"})`,
        // Random coords around Nairobi (-1.2921, 36.8219)
        lat: -1.2921 + (Math.random() - 0.5) * 0.05,
        lng: 36.8219 + (Math.random() - 0.5) * 0.05,
        status: v.assignment_status
      }));

      setMapVehicles(mappedVehicles);

    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Action buttons moved to Sidebar/Dedicated pages */}

          <button onClick={logout} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value="KES 4.2M" subtext="Vs. KES 3.75M last month" trend="+12%" trendUp={true} />
        <StatCard label="Active Fleet" value="45/50" subtext="5 vehicles in maintenance" trend="+2%" trendUp={true} />
        <StatCard label="Daily Passengers" value="12.4K" subtext="Due to heavy rains" trend="-5%" trendUp={false} />
        <StatCard label="Fuel Efficiency" value="8.5 km/L" subtext="Fleet average" badge="Stable" />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="mc-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
              <p className="text-text-muted text-sm">Last 7 Days vs Previous Week</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </div>
          </div>
          <RevenueChart />
        </div>

        <div className="mc-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Drivers</h3>
            <button className="text-emerald-400 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {availableDrivers.slice(0, 4).map((driver) => (
              <div key={driver.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white font-bold">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{driver.name}</p>
                    <p className="text-xs text-text-muted">{driver.email}</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">Active</span>
              </div>
            ))}
            {availableDrivers.length === 0 && <p className="text-text-muted text-sm text-center py-4">No drivers registered yet.</p>}
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION (Map) */}
      <div className="grid lg:grid-cols-1 gap-6 h-[400px]">
        {/* MINI MAP */}
        <div className="mc-card p-0 overflow-hidden relative flex flex-col">
          <div className="absolute top-4 left-4 z-10 flex justify-between w-[calc(100%-32px)] items-center">
            <h3 className="text-sm font-bold text-white bg-black/50 backdrop-blur px-3 py-1 rounded-full">Fleet Distribution</h3>
            <span className="text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded">Live</span>
          </div>
          <div className="flex-1 bg-surface-dark">
            <LiveMap vehicles={mapVehicles} centerVehicle={mapVehicles[0]} />
          </div>
        </div>
      </div>

    </div>
  );
}

// Sub-Component for Top Cards
function StatCard({ label, value, subtext, trend, trendUp, badge }) {
  return (
    <div className="mc-card p-5 hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <p className="text-text-muted text-sm font-medium">{label}</p>
        {trend && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
        {badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-text-muted">{badge}</span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-xs text-text-muted">{subtext}</p>
    </div>
  )
}
