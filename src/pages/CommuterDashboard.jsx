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
      const matchesRoute = routeFilter
        ? v.routeName?.toLowerCase().includes(routeFilter.toLowerCase())
        : true;
      const matchesSeats = v.passengerCapacity >= minSeats;
      const matchesStatus = statusFilter ? v.status === statusFilter : true;
      return matchesRoute && matchesSeats && matchesStatus;
    });
  }, [vehicles, routeFilter, minSeats, statusFilter]);

  return (
    <MainLayout role="commuter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Commuter Dashboard</h1>
        <p className="text-text-muted">
          Find matatus, track routes, and manage your trips.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            value={routeFilter}
            placeholder="Filter by route"
            onChange={(e) => setRouteFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            value={minSeats}
            placeholder="Min seats"
            onChange={(e) => setMinSeats(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Live Map</h3>
        <LiveMap
          vehicles={filteredVehicles.map((v) => ({
            ...v,
            lat: Number(v.lat),
            lng: Number(v.lng),
            route: Array.isArray(v.route)
              ? v.route.map((p) => ({
                  lat: Number(p.lat),
                  lng: Number(p.lng),
                }))
              : [],
          }))}
          centerVehicle={filteredVehicles[0]}
        />
      </div>

      {/* Vehicles */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Available Vehicles</h3>

        {filteredVehicles.length ? (
          <ul className="space-y-3">
            {filteredVehicles.map((v) => (
              <li
                key={v.id}
                className="flex justify-between items-center border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-sm text-text-muted">
                    Route: {v.routeName || "N/A"}
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p>{v.passengerCapacity} seats</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      v.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted">No vehicles match the filters.</p>
        )}
      </div>

      {/* Bookings */}
      {bookingRequests.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">Your Bookings</h3>
          <ul className="space-y-3">
            {bookingRequests.map((b) => (
              <li key={b.id} className="border rounded-lg p-3">
                <p>
                  <strong>Vehicle:</strong> {b.vehicleName}
                </p>
                <p className="text-sm text-text-muted">
                  Status: {b.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </MainLayout>
  );
};

export default CommuterDashboard;
