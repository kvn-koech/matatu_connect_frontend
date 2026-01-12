
import React, { useState, useMemo, useEffect } from "react";
import LiveMap from "../components/map/LiveMap";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import SeatSelector from "../components/seats/SeatSelector";
import { LogOut, Calendar, MapPin, Armchair, CreditCard } from "lucide-react";
import { createBooking, fetchBookings } from "../api/bookings";

const CommuterDashboard = () => {
  const { vehicles, routes } = useApp();
  const { user, logout } = useAuth(); // Get user and logout function
  const [routeFilter, setRouteFilter] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Real Bookings State
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await fetchBookings();
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      // Sort by date descending
      const sorted = data.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
      setMyBookings(sorted);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) =>
      routeFilter
        ? v.routeName?.toLowerCase().includes(routeFilter.toLowerCase())
        : true
    );
  }, [vehicles, routeFilter]);

  return (
    <>
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Good Afternoon, {user?.name?.split(" ")[0] || "Commuter"} 👋
          </h1>
          <p className="text-text-muted mt-1">
            Track matatus and book rides in real-time
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* STATS + FILTER */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-text-muted">Available Vehicles</p>
          <h2 className="text-3xl font-bold text-primary">
            {filteredVehicles.length}
          </h2>
        </div>

        <div className="card">
          <p className="text-sm text-text-muted">Active Routes</p>
          <h2 className="text-3xl font-bold text-primary">
            {[...new Set(filteredVehicles.map(v => v.routeName))].length}
          </h2>
        </div>

        <div className="card">
          <p className="text-sm text-text-muted">Filter by Route</p>
          <input
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            placeholder="e.g Thika Road"
            className="mt-2 w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* MAP */}
      <div className="bg-surface-dark rounded-2xl p-4 mb-8">
        <LiveMap
          vehicles={filteredVehicles}
          centerVehicle={filteredVehicles[0]}
        />
      </div>

      {/* VEHICLE LIST */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Available Drivers & Vehicles
          <span className="text-sm font-normal text-text-muted bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            {filteredVehicles.length} Active
          </span>
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`p-4 rounded-2xl border transition text-left relative overflow-hidden group
              ${selectedVehicle?.id === v.id
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-surface-dark hover:bg-white/5"
                }
`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-white text-lg">{v.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/5">
                      {v.routeName || "Unknown route"}
                    </span>
                  </div>
                </div>

                {/* Driver Image */}
                <div className="relative">
                  <img
                    src={v.driverImage || `https://ui-avatars.com/api/?name=${v.driverName}&background=random`}
                    alt={v.driverName}
                    className="w-10 h-10 rounded-full border-2 border-surface object-cover shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-surface-dark rounded-full px-1 py-0.5 border border-white/10 flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] font-bold text-white">{v.rating || "4.5"}</span>
                  </div>
                </div >
              </div >

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-text-muted">
                  Driver: <span className="text-slate-300">{v.driverName || "Unknown"}</span>
                </div>
                <p className="text-xs font-semibold text-primary group-hover:underline">
                  Select Vehicle →
                </p>
              </div>
            </button >
          ))}
        </div >
      </div >

      {/* ALL ROUTES */}
      < div className="mb-10" >
        <h3 className="text-xl font-bold text-white mb-4">All Routes</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => (
            <div key={route.id} className="p-4 bg-surface-dark rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Route {route.id}</p>
                  <p className="font-bold text-white text-lg">{route.origin} → {route.destination}</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold">
                  KES {route.fare}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted mt-3 pt-3 border-t border-white/5">
                <span className="flex items-center gap-1">⏱️ {route.estimated_duration || '45 mins'}</span>
                <span className="flex items-center gap-1">📏 {route.distance || '15 km'}</span>
              </div>
            </div>
          ))}
          {routes.length === 0 && (
            <div className="col-span-full text-center py-8 text-text-muted italic">
              No routes found.
            </div>
          )}
        </div>
      </div >

      {/* SEAT SELECTION */}
      {
        selectedVehicle && (
          <SeatSelector
            totalSeats={selectedVehicle.passengerCapacity || 14}
            matatuId={selectedVehicle.id}
            onConfirm={async (seats) => {
              try {
                for (const seat of seats) {
                  await createBooking({
                    matatu_id: selectedVehicle.id,
                    seat_number: seat
                  });
                }
                alert(`Successfully booked seat(s) ${seats.join(", ")} on ${selectedVehicle.name}`);
                setSelectedVehicle(null);
                loadBookings(); // Refresh bookings list
              } catch (err) {
                console.error("Booking failed", err);
                const msg = err.response?.data?.error || err.response?.data?.message || "Failed to book seat. Please try again.";
                alert(msg);
              }
            }}
          />
        )
      }

      {/* BOOKINGS SECTION */}
      <div className="bg-surface-dark rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Your Trip History</h3>
          <button onClick={loadBookings} className="text-sm text-emerald-400 hover:text-emerald-300">
            Refresh
          </button>
        </div>

        {loadingBookings ? (
          <div className="text-center py-8 text-text-muted">Loading your trips...</div>
        ) : myBookings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {myBookings.map((booking) => (
              <div key={booking.id} className={`mc-card p-5 group transition-all flex flex-col gap-3 ${booking.status === 'rejected' ? 'border-red-500/30 bg-red-500/5' :
                  booking.status === 'confirmed' ? 'border-emerald-500/20' :
                    'hover:border-emerald-500/30'
                }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-lg">{booking.matatu?.plate || "Unknown Vehicle"}</h4>
                    <p className="text-xs text-text-muted">{booking.matatu?.route || "Route Info Unavailable"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      booking.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' :
                        booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    }`}>
                    {booking.status}
                  </span>
                </div>

                {booking.status === 'rejected' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
                    <p className="text-red-400 font-semibold">❌ Booking Rejected by Driver</p>
                    <p className="text-red-300/70 text-xs mt-1">This seat is now available for other passengers. Please select another vehicle or time slot.</p>
                  </div>
                )}

                {booking.status === 'pending' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-xs">
                    <p className="text-yellow-400">⏳ Awaiting driver confirmation...</p>
                  </div>
                )}

                <div className="h-px bg-white/5 my-1" />

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Calendar size={14} className="text-emerald-500" />
                    <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <Armchair size={14} className="text-emerald-500" />
                    <span>Seat {booking.seat_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <CreditCard size={14} className="text-emerald-500" />
                    <span>{booking.payment_status === 'completed' ? 'Paid' : 'Unpaid'} ({booking.payment_amount}/=)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-black/20 rounded-xl border border-dashed border-white/10">
            <MapPin size={48} className="mx-auto mb-3 text-emerald-500/20" />
            <p className="text-text-muted">No bookings yet. Select a vehicle above to book your first ride!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CommuterDashboard;

