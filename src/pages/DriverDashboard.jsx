import React, { useState, useMemo } from "react";
import LiveMap from "../components/map/LiveMap";
import { useApp } from "../context/AppContext";
import MainLayout from "../components/layout/MainLayout";

const DriverDashboard = () => {
  const { vehicles, bookingRequests, respondToBooking } = useApp();
  const [online, setOnline] = useState(false);

  const driverId = 101;
  const myVehicle = vehicles.find((v) => v.driverId === driverId);

  const filteredVehicles = useMemo(() => {
    if (!myVehicle) return [];
    return vehicles.filter(
      (v) => v.routeName === myVehicle.routeName && v.id !== myVehicle.id
    );
  }, [vehicles, myVehicle]);

  return (
    <MainLayout role="driver">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <p className="text-text-muted">
            Manage your vehicle and incoming bookings.
          </p>
        </div>

        <button
          onClick={() => setOnline(!online)}
          className={`px-5 py-2 rounded-lg text-white ${
            online ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {online ? "Online" : "Offline"}
        </button>
      </div>

      {/* Map */}
      {myVehicle && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-3">Live Route</h3>
          <LiveMap
            vehicles={[myVehicle, ...filteredVehicles].map((v) => ({
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
            centerVehicle={myVehicle}
          />
        </div>
      )}

      {/* Vehicle */}
      {myVehicle && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-3">Your Vehicle</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <p><strong>Name:</strong> {myVehicle.name}</p>
            <p><strong>Seats:</strong> {myVehicle.passengerCapacity}</p>
            <p><strong>Status:</strong> {myVehicle.status}</p>
          </div>
        </div>
      )}

      {/* Bookings */}
      {bookingRequests.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">Booking Requests</h3>

          <ul className="space-y-3">
            {bookingRequests.map((b) => (
              <li key={b.id} className="border rounded-lg p-3">
                <p className="font-medium">{b.commuterName}</p>
                <p className="text-sm text-text-muted mb-2">
                  Status: {b.status}
                </p>

                {b.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => respondToBooking(b.id, "accepted")}
                      className="btn-primary"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToBooking(b.id, "rejected")}
                      className="btn-outline"
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
    </MainLayout>
  );
};

export default DriverDashboard;
