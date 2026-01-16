import React, { useState } from "react";
import { getGreeting } from "../utils/greeting";
import LiveMap from "../components/map/LiveMap";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  LogOut,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { fetchMatatus } from "../api/matatus";
import { fetchRoutes } from "../api/routes";
import { fetchDrivers } from "../api/users";
import { fetchSaccoStats } from "../api/dashboard";
import { fetchLogs } from "../api/logs"; // Import log API
import RevenueChart from "../components/charts/RevenueChart";

export default function SaccoManagementDashboard() {
  const { user, logout } = useAuth();

  // Data States
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [mapVehicles, setMapVehicles] = useState([]);
  const [saccoStats, setSaccoStats] = useState({ total_revenue: 0 });
  const [recentLogs, setRecentLogs] = useState([]); // New State for Logs

  // Fetch Data
  const loadData = async () => {
    try {
      // Fetch Logs
      fetchLogs().then(res => {
        console.log("Logs API Response:", res);
        // Support both { data: [...] } and { data: { data: [...] } }
        const logs = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setRecentLogs(logs);
      }).catch(err => console.error("Logs fetch failed", err));

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

      // Fetch Sacco Stats
      const resStats = await fetchSaccoStats();
      setSaccoStats(resStats.data.data || { total_revenue: 0 });

    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  // Sacco Selection State
  const [showSaccoModal, setShowSaccoModal] = useState(false);
  const [saccos, setSaccos] = useState([]);
  const [selectedSaccoId, setSelectedSaccoId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Fetch Saccos
  const fetchSaccos = async () => {
    try {
      // Direct fetch or via api/saccos.js
      const response = await fetch("/api/saccos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      });
      const data = await response.json();
      if (data.status === "success") {
        setSaccos(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch saccos", err);
    }
  };

  const handleJoinSacco = async () => {
    if (!selectedSaccoId) return;
    setIsJoining(true);
    try {
      const response = await fetch("/api/saccos/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ sacco_id: Number(selectedSaccoId) })
      });
      const res = await response.json();

      if (response.ok) {
        alert(`Successfully joined ${res.data.sacco.name}! Please login again to refresh permissions.`);
        logout(); // Force re-login to update token/context
      } else {
        alert(res.message || "Failed to join Sacco");
      }
    } catch (err) {
      console.error(err);
      alert("Error joining Sacco");
    } finally {
      setIsJoining(false);
    }
  };

  const socket = useSocket();

  React.useEffect(() => {
    if (user && !user.sacco_id) {
      setShowSaccoModal(true);
      fetchSaccos();
    } else {
      loadData();
    }

    // Socket logic ...
    if (socket && user?.sacco_id) {
      socket.emit("join_sacco", { sacco_id: user.sacco_id });

      const handleUpdate = (data) => {
        console.log("Sacco update received:", data);
        loadData(); // Re-fetch stats
      };

      socket.on("sacco_update", handleUpdate);

      return () => {
        socket.off("sacco_update", handleUpdate);
      };
    }
  }, [socket, user]);

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
        <StatCard
          label="Total Revenue"
          value={`KES ${saccoStats.total_revenue?.toLocaleString() || '0'}`}
          subtext="Total earnings"
          trend={saccoStats.revenue_growth !== undefined ? `${saccoStats.revenue_growth > 0 ? '+' : ''}${saccoStats.revenue_growth}%` : "0%"}
          trendUp={saccoStats.revenue_growth >= 0}
        />
        <StatCard
          label="Active Fleet"
          value={saccoStats.active_fleet || "0/0"}
          subtext="Vehicles on road"
          trend="+0%"
          trendUp={true}
          badge="Live"
        />
        <StatCard
          label="Daily Passengers"
          value={saccoStats.daily_passengers?.toLocaleString() || "0"}
          subtext="Today's total"
          trend={saccoStats.passenger_growth !== undefined ? `${saccoStats.passenger_growth > 0 ? '+' : ''}${saccoStats.passenger_growth}%` : "0%"}
          trendUp={saccoStats.passenger_growth >= 0}
        />
        <StatCard
          label="Fuel Efficiency"
          value={saccoStats.fuel_efficiency || "0.0 km/L"}
          subtext="Fleet average"
          badge="Lifetime"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="mc-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
              <p className="text-text-muted text-sm">Last 7 Days vs Previous Week</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${saccoStats.revenue_growth >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
              {saccoStats.revenue_growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {saccoStats.revenue_growth !== undefined ? `${saccoStats.revenue_growth > 0 ? '+' : ''}${saccoStats.revenue_growth}%` : "0%"}
            </div>
          </div>
          <RevenueChart data={saccoStats.revenue_trend} />
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



      {/* DRIVER LOGS SECTION */}
      <div className="mc-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Daily Logs</h3>
        {recentLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-muted">
              <thead className="text-xs uppercase bg-white/5 text-white">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Date</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Passengers</th>
                  <th className="px-4 py-3">Fuel (L)</th>
                  <th className="px-4 py-3 rounded-r-lg">Mileage (km)</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">{new Date(log.log_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-white font-medium">{log.driver_name}</td>
                    <td className="px-4 py-3">Active Vehicle</td>
                    <td className="px-4 py-3">{log.passengers}</td>
                    <td className="px-4 py-3">{log.fuel_liters}</td>
                    <td className="px-4 py-3">{log.mileage_km}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
            No daily logs submitted yet.
          </p>
        )}
      </div>

      {/* SACCO SELECTION MODAL */}
      {showSaccoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Select Your Sacco</h2>
            <p className="text-text-muted text-sm mb-6">
              You are not assigned to a Sacco yet. Please select one to continue.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Available Saccos</label>
                <select
                  value={selectedSaccoId}
                  onChange={(e) => setSelectedSaccoId(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">-- Choose a Sacco --</option>
                  {saccos.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleJoinSacco}
                disabled={!selectedSaccoId || isJoining}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? "Joining..." : "Join Sacco"}
              </button>

              <button
                onClick={logout}
                className="w-full py-2 text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

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
