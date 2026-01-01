import React, { useState, useMemo } from "react";
import LiveMap from "../components/map/LiveMap";
import { useApp } from "../context/AppContext";
import MainLayout from "../components/layout/MainLayout";

const DriverDashboard = ({ driverId, showSameRouteOnly = true }) => {
  const { vehicles, bookingRequests, respondToBooking } = useApp();
  const [online, setOnline] = useState(false);

  const toggleOnline = () => setOnline(!online);

  const myVehicle = vehicles.find((v) => v.driverId === driverId);

  const filteredVehicles = useMemo(() => {
    if (!myVehicle) return [];
    if (!showSameRouteOnly) return vehicles;
    return vehicles.filter(
      (v) =>
        v.routeName &&
        myVehicle.routeName &&
        v.routeName === myVehicle.routeName &&
        v.id !== myVehicle.id
    );
  }, [vehicles, myVehicle, showSameRouteOnly]);

  return (
    <MainLayout role="driver">
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4">Driver Dashboard</h2>

        {/* Online Toggle */}
        <button
          onClick={toggleOnline}
          className={`px-4 py-2 mb-4 rounded text-white ${online ? "bg-green-600" : "bg-gray-500"}`}
        >
          {online ? "Go Offline" : "Go Online"}
        </button>

        {/* Live Map */}
        {myVehicle && (
          <div className="map-container mb-6">
            <LiveMap
              vehicles={[myVehicle, ...filteredVehicles].map((v) => ({
                ...v,
                lat: Number(v.lat),
                lng: Number(v.lng),
                route: Array.isArray(v.route)
                  ? v.route.map((p) => ({ lat: Number(p.lat), lng: Number(p.lng) }))
                  : [],
              }))}
              centerVehicle={myVehicle}
            />
          </div>
        )}

        {/* My Vehicle Info */}
        {myVehicle && (
          <div className="mt-4 p-4 border rounded shadow-sm bg-white">
            <h3 className="text-xl font-semibold mb-2">Your Vehicle</h3>
            <p><strong>Name:</strong> {myVehicle.name}</p>
            <p><strong>Status:</strong> {myVehicle.status}</p>
            <p><strong>Seats Available:</strong> {myVehicle.passengerCapacity}</p>
            {myVehicle.routeName && <p><strong>Route:</strong> {myVehicle.routeName}</p>}
          </div>
        )}

        {/* Other Vehicles on Route */}
        {filteredVehicles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Other Vehicles on Your Route</h3>
            <ul className="space-y-1">
              {filteredVehicles.map((v) => (
                <li key={v.id} className="border p-2 rounded shadow-sm">
                  <strong>{v.name}</strong> – {v.status} – {v.passengerCapacity} seats
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Booking Requests */}
        {bookingRequests.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Live Booking Requests</h3>
            <ul className="space-y-1">
              {bookingRequests.map((b) => (
                <li key={b.id} className="border p-2 rounded shadow-sm">
                  <p><strong>Commuter:</strong> {b.commuterName}</p>
                  <p>
                    <strong>Pickup:</strong> ({b.pickup.lat.toFixed(4)}, {b.pickup.lng.toFixed(4)})
                  </p>
                  <p>
                    <strong>Dropoff:</strong> ({b.dropoff.lat.toFixed(4)}, {b.dropoff.lng.toFixed(4)})
                  </p>
                  <p><strong>Seats:</strong> {b.seats}</p>
                  <p><strong>Status:</strong> {b.status}</p>

                  {b.status === "pending" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => respondToBooking(b.id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={() => respondToBooking(b.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DriverDashboard;
