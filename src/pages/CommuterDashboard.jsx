import React, { useState, useMemo } from "react";
import LiveMap from "../components/map/LiveMap";
import { useApp } from "../context/AppContext";
import MainLayout from "../components/layout/MainLayout";

const CommuterDashboard = () => {
  const { vehicles, bookingRequests } = useApp();
  const [routeFilter, setRouteFilter] = useState("");
  const [minSeats, setMinSeats] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesRoute = routeFilter ? v.routeName?.toLowerCase().includes(routeFilter.toLowerCase()) : true;
      const matchesSeats = v.passengerCapacity >= minSeats;
      const matchesStatus = statusFilter ? v.status === statusFilter : true;
      return matchesRoute && matchesSeats && matchesStatus;
    });
  }, [vehicles, routeFilter, minSeats, statusFilter]);

  return (
    <MainLayout role="commuter">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Commuter Dashboard</h2>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block font-semibold mb-1">Route</label>
            <input
              type="text"
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              placeholder="Enter route"
              className="border p-1 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Min Seats</label>
            <input
              type="number"
              value={minSeats}
              onChange={(e) => setMinSeats(Number(e.target.value))}
              className="border p-1 rounded w-20"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
          </div>
        </div>

        {/* Live Map */}
        <div className="map-container mb-6">
          <LiveMap
            vehicles={filteredVehicles
              .filter((v) => v.lat !== undefined && v.lng !== undefined)
              .map((v) => ({
                ...v,
                lat: Number(v.lat),
                lng: Number(v.lng),
                route: Array.isArray(v.route)
                  ? v.route.map((p) => ({ lat: Number(p.lat), lng: Number(p.lng) }))
                  : [],
              }))}
            centerVehicle={filteredVehicles[0]}
          />
        </div>

        {/* Available Vehicles */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Available Vehicles</h3>
          <ul className="space-y-1">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((v) => (
                <li key={v.id} className="border p-2 rounded shadow-sm">
                  <strong>{v.name}</strong> - {v.status} - {v.passengerCapacity} seats
                  {v.routeName && <span> - Route: {v.routeName}</span>}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No vehicles match the filters.</li>
            )}
          </ul>
        </div>

        {/* Booking Status */}
        {bookingRequests.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Your Booking Status</h3>
            <ul className="space-y-1">
              {bookingRequests.map((b) => (
                <li key={b.id} className="border p-2 rounded shadow-sm">
                  <p><strong>Vehicle:</strong> {b.vehicleName}</p>
                  <p><strong>Status:</strong> {b.status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CommuterDashboard;
