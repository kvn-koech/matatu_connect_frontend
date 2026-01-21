import React, { useState, useMemo, useEffect } from "react";
import { getGreeting } from "../utils/greeting";
import LiveMap from "../components/map/LiveMap";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import { Clock, LogOut, MapPin, Navigation, Phone, Search, Users, Wallet, CheckCircle, XCircle, Bell, CreditCard, TrendingUp, Flag } from "lucide-react";
import { acceptVehicle, rejectVehicle, fetchMatatus } from "../api/matatus";
import { fetchBookings, updateBookingStatus, completeTrip } from "../api/bookings";
import { triggerStkPush } from "../api/payment";

import { submitDriverLog } from "../api/logs";
import { fetchNotifications, markNotificationRead } from "../api/notifications";

const DriverDashboard = () => {
  const { vehicles, setVehicles } = useApp();
  const { user, logout } = useAuth();
  const socket = useSocket();
  const [online, setOnline] = useState(false);
  const [onlineDuration, setOnlineDuration] = useState("0h 0m");

  useEffect(() => {
    // Check for persisted session
    const storedStart = localStorage.getItem("onlineStartTime");
    if (storedStart) {
      setOnline(true);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (online) {
      if (!localStorage.getItem("onlineStartTime")) {
        localStorage.setItem("onlineStartTime", Date.now().toString());
      }

      interval = setInterval(() => {
        const start = parseInt(localStorage.getItem("onlineStartTime"));
        const diff = Date.now() - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setOnlineDuration(`${hours}h ${minutes}m`);
      }, 60000); // Update every minute

      // Initial call
      const start = parseInt(localStorage.getItem("onlineStartTime"));
      const diff = Date.now() - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setOnlineDuration(`${hours}h ${minutes}m`);

    } else {
      localStorage.removeItem("onlineStartTime");
      setOnlineDuration("0h 0m");
    }
    return () => clearInterval(interval);
  }, [online]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState("Just now");

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ phone: "", amount: "" });
  const [isSendingPayment, setIsSendingPayment] = useState(false);

  // Log Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({ passengers: "", fuel: "", mileage: "" });

  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // Trip Completion State
  const [isCompletingTrip, setIsCompletingTrip] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();

    // Ticker for "Updated X ago"
    const timer = setInterval(() => {
      const diff = Math.floor((new Date() - lastUpdated) / 1000);
      if (diff < 5) setTimeAgo("Just now");
      else if (diff < 60) setTimeAgo(`${diff}s ago`);
      else if (diff < 3600) setTimeAgo(`${Math.floor(diff / 60)}m ago`);
      else setTimeAgo(`${Math.floor(diff / 3600)}h ago`);
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdated]);

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  // Find vehicle assigned to this driver
  const myVehicle = useMemo(() => {
    if (!user || !vehicles) return null;
    return vehicles.find((v) => v.driverId === user.id);
  }, [vehicles, user]);

  useEffect(() => {
    if (myVehicle && myVehicle.assignment_status === 'active') {
      loadBookings();

      if (socket) {
        console.log("Attempting to join Matatu Room:", myVehicle.id);
        socket.emit("join_matatu", { matatu_id: myVehicle.id });

        socket.on("new_booking", (newBooking) => {
          console.log("New booking received:", newBooking);

          // Play notification sound
          const audio = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
          audio.play().catch(e => console.log("Audio play failed:", e));

          setBookings(prev => [newBooking, ...prev]);
          setLastUpdated(new Date()); // Update timestamp
          // alert(`New booking: ${newBooking.seat_number}`); // Removed blocking alert
        });

        socket.on("booking_updated", (updatedBooking) => {
          console.log("Booking updated PAYLOAD:", updatedBooking);
          setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
          setLastUpdated(new Date()); // Update timestamp
        });

        return () => {
          socket.off("new_booking");
          socket.off("booking_updated");
        };
      }
    }
  }, [myVehicle, socket]);

  const loadBookings = async () => {
    try {
      const res = await fetchBookings();
      // Ensure we get an array. The backend returns { data: [...], message: "..." }
      const data = res.data.data || [];
      setBookings(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  const handleAccept = async () => {
    if (!myVehicle) return;
    setIsProcessing(true);
    try {
      await acceptVehicle(myVehicle.id);
      alert("Assignment Accepted! You are now active.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to accept");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!myVehicle) return;
    if (!window.confirm("Are you sure you want to reject this assignment?")) return;
    setIsProcessing(true);
    try {
      await rejectVehicle(myVehicle.id);
      alert("Assignment Rejected.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookingAction = async (id, action) => {
    try {
      await updateBookingStatus(id, action);
      // Optimistic update or reload
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: action === 'accept' ? 'confirmed' : 'rejected' } : b
      ));
      // alert(`Booking ${action}ed`);
    } catch (err) {
      console.error(`Failed to ${action} booking`, err);
      alert(`Failed to ${action} booking`);
    }
  };

  // TRIP COMPLETION HANDLER
  const handleCompleteTrip = async () => {
    if (!window.confirm("Are you sure you want to finish this trip? All confirmed passengers will be marked as dropped off.")) return;

    setIsCompletingTrip(true);
    try {
      const res = await completeTrip();
      alert(res.data.message || "Trip completed successfully!");
      loadBookings(); // Refresh bookings to show new status
    } catch (err) {
      console.error("Failed to complete trip", err);
      alert("Error completing trip: " + (err.response?.data?.error || err.message));
    } finally {
      setIsCompletingTrip(false);
    }
  };

  // PAYMENT HANDLERS
  const openPaymentModal = (booking) => {
    setSelectedBookingForPayment(booking);
    // Prefill phone number if available from the user profile (booking.user_phone)
    setPaymentForm({
      phone: booking.user_phone || "",
      amount: "50"
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForPayment) return;

    setIsSendingPayment(true);
    try {
      await triggerStkPush({
        phone_number: paymentForm.phone,
        amount: Number(paymentForm.amount),
        booking_id: selectedBookingForPayment.id
      });
      alert(`Payment Request sent to ${paymentForm.phone}. Ask passenger to check their phone.`);
      setShowPaymentModal(false);
      setPaymentForm({ phone: "", amount: "" });
    } catch (err) {
      console.error("Payment Error", err);
      alert("Payment request failed. Please check the phone number and network, then try again.");
    } finally {
      setIsSendingPayment(false);
    }
  };

  // LOG HANDLERS
  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingLog(true);
    try {
      await submitDriverLog({
        passengers: logForm.passengers,
        fuel: logForm.fuel,
        mileage: logForm.mileage
      });
      alert("Daily Log Submitted Successfully!");
      setShowLogModal(false);
      setLogForm({ passengers: "", fuel: "", mileage: "" });
    } catch (err) {
      console.error("Log Error", err);
      alert("Failed to submit log: " + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // UNASSIGNED DRIVER (No Sacco)
  if (!user?.sacco_id) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
        <div className="mc-card w-full max-w-lg p-8 text-center animate-in zoom-in duration-300 border-red-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
          <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <XCircle className="w-10 h-10" />
          </div>
          <h2 className="mc-h2 text-white mb-2">Account Not Active</h2>
          <p className="mc-muted mb-8 leading-relaxed">
            You are not currently assigned to any Sacco. <br />
            Please contact your Sacco Manager to verify your account and add you to the fleet.
          </p>
          <button onClick={logout} className="mc-btn-secondary px-8 py-3">
            Logout
          </button>
        </div>
      </div>
    );
  }

  // NO VEHICLE ASSIGNED
  if (!myVehicle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
        <div className="mc-card w-full max-w-lg p-8 text-center animate-in zoom-in duration-300 border-amber-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
          <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="mc-h2 text-white mb-2">Waiting for Assignment</h2>
          <p className="mc-muted mb-8 leading-relaxed">
            You are signed in, but not yet assigned to a vehicle. <br />
            Wait for your Sacco Manager to assign a Matatu to you.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="mc-btn-primary px-6">
              Refresh Status
            </button>
            <button onClick={logout} className="mc-btn-secondary px-6">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PENDING ASSIGNMENT MODAL
  if (myVehicle && myVehicle.assignment_status === "pending") {
    // ... (Modal Content - Unchanged)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
        <div className="mc-card w-full max-w-lg p-8 text-center animate-in zoom-in duration-300 border-emerald-500/30 shadow-glow-lg">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/30 animate-pulseSlow">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="mc-h2 text-white mb-2">New Vehicle Assignment</h2>
          <p className="mc-muted mb-8 leading-relaxed">
            You have been assigned to drive <strong className="text-white bg-white/10 px-2 py-0.5 rounded ml-1">{myVehicle.plate_number}</strong>.
            <br />
            Capacity: {myVehicle.capacity || 14} Passengers.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="mc-btn-danger flex items-center justify-center gap-2 py-3"
            >
              <XCircle className="w-5 h-5" /> Reject
            </button>
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="mc-btn-primary flex items-center justify-center gap-2 py-3"
            >
              <CheckCircle className="w-5 h-5" /> Accept Assignment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transform bookings to UI format (exclude rejected)
  const upcomingPickups = bookings
    .filter(b => b.status !== 'rejected')  // Only show pending and confirmed
    .map((b, idx) => ({
      id: b.id,
      name: b.user_name || "Passenger",
      location: "Boarding Point", // Could get from route origin
      time: "Ready",
      type: idx === 0 ? "next" : "upcoming",
      status: b.status,  // Add status for display
      seatNumber: b.seat_number,
      avatar: `https://i.pravatar.cc/150?img=${(b.id % 70) + 1}`
    }));

  // Fallback if no bookings
  if (upcomingPickups.length === 0 && myVehicle) {
    upcomingPickups.push({ id: 999, name: "No passengers yet", location: "Waiting for bookings", time: "--", type: "upcoming", avatar: "https://i.pravatar.cc/150?img=0" });
  }

  return (
    <div className="mc-shell space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="mc-h1 flex items-center gap-3">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Driver"}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="mc-muted mt-1 flex items-center gap-2">
            {myVehicle ? (
              <>
                Vehicle: <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded border border-white/5">{myVehicle.plate_number}</span>
                <span className="mc-badge mc-badge-success">Active</span>
              </>
            ) : "No vehicle assigned currently."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-3 rounded-xl border border-white/10 transition-all duration-200 ${showNotifications ? 'bg-white/10 text-white' : 'bg-surface hover:bg-white/5 text-slate-400'
                }`}
            >
              <Bell size={20} />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-surface-light border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h4 className="font-bold text-white text-sm uppercase tracking-wide">Notifications</h4>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">{notifications.filter(n => !n.is_read).length} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-text-muted">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(note => (
                      <div
                        key={note.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!note.is_read ? 'bg-emerald-500/5' : ''}`}
                        onClick={() => handleRead(note.id)}
                      >
                        <p className={`text-sm mb-1 ${!note.is_read ? 'text-white font-semibold' : 'text-slate-400'}`}>
                          {note.message}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">{new Date(note.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Complete Trip Button */}
          {myVehicle && (
            <button
              onClick={handleCompleteTrip}
              disabled={isCompletingTrip || bookings.filter(b => b.status === "confirmed").length === 0}
              className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all font-bold text-sm shadow-lg
                  ${bookings.filter(b => b.status === "confirmed").length > 0
                  ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white border-transparent shadow-red-500/20"
                  : "bg-surface border-white/5 text-slate-500 cursor-not-allowed opacity-50"
                }
                `}
            >
              {isCompletingTrip ? <span className="animate-spin">⌛</span> : <Flag className="w-4 h-4 fill-current" />}
              {isCompletingTrip ? "Finishing..." : "End Trip"}
            </button>
          )}

          {/* Online Toggle */}
          <div
            className={`
              flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer select-none group
              ${online ? "bg-emerald-500/10 border-emerald-500/30" : "bg-surface-light border-white/5 hover:bg-white/5"}
            `}
            onClick={() => setOnline(!online)}
          >
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${online ? "bg-emerald-500" : "bg-slate-600"}`}>
              <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-md transition-transform duration-300 ${online ? "translate-x-5" : ""}`} />
            </div>
            <p className={`font-bold text-sm ${online ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}`}>
              {online ? "Online" : "Offline"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogModal(true)}
              className="mc-btn-secondary p-2.5 text-slate-400 hover:text-white"
              title="Log Stats"
            >
              <Clock className="w-5 h-5" />
            </button>

            <button
              onClick={logout}
              className="mc-btn-secondary p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* EARNINGS CARD (Big Green) */}
        <div className="lg:col-span-2 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 transition-all duration-500 group-hover:scale-105" />
          <div className="absolute top-0 right-0 p-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none mix-blend-overlay" />

          <div className="relative z-10 flex justify-between items-start text-white">
            <div>
              <p className="font-medium opacity-90 mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Today's Earnings
              </p>
              <h2 className="text-6xl font-extrabold mb-6 tracking-tight">
                <span className="text-3xl opacity-60 mr-2">KES</span>
                {bookings.reduce((sum, b) => {
                  const isToday = new Date(b.booking_date).toDateString() === new Date().toDateString();
                  return sum + ((b.payment_status === 'completed' && isToday) ? (b.payment_amount || 0) : 0);
                }, 0).toLocaleString()}
              </h2>

              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Real-time
                </div>
                <span className="text-xs opacity-70 font-medium">Updated {timeAgo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SIDE STATS */}
        <div className="space-y-6">
          <StatCard
            icon={<Clock className="w-6 h-6 text-amber-400" />}
            label="Hours Online"
            value={onlineDuration}
            subtext={online ? "Currently Active" : "Offline"}
            variant="warning"
          />
          <StatCard
            icon={<Navigation className="w-6 h-6 text-emerald-400" />}
            label="Trips Today"
            value={bookings.length.toString()}
            subtext="Total Passengers"
            variant="success"
          />
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* COLUMN 1: Pending & Upcoming */}
        <div className="space-y-6">
          {/* PENDING BOOKINGS */}
          {bookings.filter(b => b.status === 'pending').length > 0 && (
            <div className="mc-card bg-surface-light border-amber-500/20 shadow-glow overflow-visible relative">
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold uppercase rounded-full shadow-lg flex items-center gap-2">
                  <Bell className="w-3 h-3 fill-current animate-bounce" /> New Requests
                </span>
              </div>

              <div className="p-6 pt-8 space-y-3">
                {bookings.filter(b => b.status === 'pending').map(booking => (
                  <div key={booking.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                          {booking.user_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{booking.user_name}</p>
                          <p className="text-xs text-text-muted flex items-center gap-2">
                            <span>Seat {booking.seat_number}</span> &bull; <span>{booking.payment_status}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBookingAction(booking.id, 'reject')}
                          className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'accept')}
                          className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
                          title="Accept"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Payment Trigger Button (Only if not paid) */}
                    {booking.payment_status !== 'completed' && (
                      <button
                        onClick={() => openPaymentModal(booking)}
                        className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors border border-blue-500/20"
                      >
                        <CreditCard className="w-4 h-4" /> Request Payment (Secure)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPCOMING PICKUPS */}
          <div className="mc-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="mc-h3 flex items-center gap-2">
                <MapPin className="text-emerald-400 w-5 h-5" /> Upcoming Pickups
              </h3>
              <button className="text-emerald-400 text-xs font-bold uppercase hover:underline tracking-wide">View All</button>
            </div>

            <div className="space-y-3">
              {upcomingPickups.map((pickup, idx) => (
                <div key={pickup.id} className={`p-4 rounded-2xl transition-all border ${pickup.type === "next"
                  ? "bg-emerald-500/5 border-emerald-500/20 shadow-glow"
                  : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                  }`}>
                  {pickup.type === "next" && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Next Stop
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">{pickup.time} away</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={pickup.avatar} alt={pickup.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/5 bg-slate-800" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-sm">{pickup.name}</p>
                          {pickup.status && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${pickup.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }`}>
                              {pickup.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                          <span className="opacity-60">{pickup.location}</span>
                          {pickup.seatNumber && <span className="text-slate-500">• Seat {pickup.seatNumber}</span>}
                        </div>
                      </div>
                    </div>

                    {pickup.type === "next" ? (
                      <button className="mc-btn-primary py-1.5 px-4 text-xs">
                        Arrived
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">{pickup.time}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* END COLUMN 1 */}

        {/* COLUMN 2: SEAT LAYOUT & ROUTE PREVIEW */}
        <div className="space-y-6">
          {/* SEAT LAYOUT */}
          <div className="mc-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="mc-h3">Seat Layout</h3>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide">
                <span className="flex items-center gap-1.5 text-slate-400"><div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/20"></div> Occupied</span>
                <span className="flex items-center gap-1.5 text-slate-400"><div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></div> Pending</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 mc-grid opacity-20" />

              {/* Driver Seat Row */}
              <div className="w-full flex justify-end mb-8 border-b-2 border-dashed border-white/5 pb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-glow relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Passenger Seats Grid */}
              <div className="grid grid-cols-4 gap-4 w-full max-w-xs relative z-10">
                {Array.from({ length: myVehicle?.capacity || 14 }).map((_, i) => {
                  const seatNum = (i + 1).toString();
                  const booking = bookings.find(b => String(b.seat_number) === seatNum && b.status !== 'rejected');
                  const isConfirmed = booking?.status === 'confirmed';
                  const isPending = booking?.status === 'pending';

                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 relative group
                        ${isConfirmed
                          ? "bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                          : isPending
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-400 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                            : "bg-surface-light border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                        }
                      `}
                      title={booking ? `${booking.user_name} (${booking.status})` : "Available"}
                    >
                      {seatNum}
                      {booking && (
                        <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none">
                          {booking.user_name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                <Users className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-bold text-slate-300">
                  <span className="text-white text-sm">{bookings.filter(b => b.status === 'confirmed').length}</span> <span className="text-slate-500">of</span> {myVehicle?.capacity || 14} Seats
                </p>
              </div>
            </div>
          </div>

          {/* MAP / ROUTE PREVIEW */}
          <div className="mc-card p-6 min-h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="mc-h3">Route View</h3>
              <button className="mc-btn-icon"><Search className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/5">
              {myVehicle ? (
                <LiveMap vehicles={[myVehicle]} centerVehicle={myVehicle} />
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted bg-slate-900/50">
                  <p>No active vehicle assigned to track.</p>
                </div>
              )}

              {/* Traffic Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-start gap-4 shadow-xl">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">Heavy Traffic Detected</p>
                  <p className="text-xs text-slate-400">Expected delay: <span className="text-amber-400 font-bold">+5 mins</span> on Waiyaki Way</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* END COLUMN 2 */}

      </div>{/* End Bottom Grid */}

      {/* PAYMENT MODAL */}
      {
        showPaymentModal && (
          <div className="mc-modal-backdrop">
            <div className="mc-modal-content">
              <div className="mc-modal-header">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wallet className="text-emerald-400" /> Request Payment
                </h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="mc-modal-body space-y-5">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wide mb-1">Passenger</p>
                  <p className="text-lg font-bold text-white">{selectedBookingForPayment?.user_name}</p>
                </div>

                <div>
                  <label className="mc-label">M-Pesa Phone Number</label>
                  <input
                    name="phone"
                    placeholder="0712345678"
                    className="mc-input font-mono"
                    value={paymentForm.phone}
                    onChange={(e) => setPaymentForm({ ...paymentForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="mc-label">Amount (KES)</label>
                  <input
                    name="amount"
                    type="number"
                    placeholder="50"
                    className="mc-input font-mono"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                  />
                </div>

                <button
                  disabled={isSendingPayment}
                  className="mc-btn-primary w-full py-3.5 shadow-lg"
                >
                  {isSendingPayment ? <span className="animate-spin">⌛</span> : <Phone className="w-4 h-4" />}
                  {isSendingPayment ? "Sending Request..." : "Send STK Push"}
                </button>
              </form>
            </div>
          </div>
        )}

      {/* LOG STATS MODAL */}
      {showLogModal && (
        <div className="mc-modal-backdrop">
          <div className="mc-modal-content border-purple-500/20">
            <div className="mc-modal-header">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-purple-400" /> Log Daily Stats
              </h2>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>

            <form onSubmit={handleLogSubmit} className="mc-modal-body space-y-5">
              <div>
                <label className="mc-label">Total Passengers Carried</label>
                <input
                  name="passengers"
                  type="number"
                  placeholder="e.g 150"
                  className="mc-input"
                  value={logForm.passengers}
                  onChange={(e) => setLogForm({ ...logForm, passengers: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mc-label">Fuel Used (L)</label>
                  <input
                    name="fuel"
                    type="number"
                    placeholder="e.g 45"
                    className="mc-input"
                    value={logForm.fuel}
                    onChange={(e) => setLogForm({ ...logForm, fuel: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mc-label">Mileage (Km)</label>
                  <input
                    name="mileage"
                    type="number"
                    placeholder="e.g 200"
                    className="mc-input"
                    value={logForm.mileage}
                    onChange={(e) => setLogForm({ ...logForm, mileage: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                disabled={isSubmittingLog}
                className="mc-btn px-6 py-3.5 w-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20"
              >
                {isSubmittingLog ? <span className="animate-spin">⌛</span> : <CheckCircle className="w-4 h-4" />}
                {isSubmittingLog ? "Submitting..." : "Submit Log"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Component for small stat cards
function StatCard({ icon, label, value, subtext, variant = "default" }) {
  const isSuccess = variant === "success";
  const isWarning = variant === "warning";

  return (
    <div className="mc-card p-6 flex flex-col justify-between h-full group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl transition-colors ${isSuccess ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20" :
            isWarning ? "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20" :
              "bg-white/5 text-white"
          }`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold uppercase py-1 px-2 rounded-lg ${isSuccess ? "bg-emerald-500/10 text-emerald-400" :
            isWarning ? "bg-amber-500/10 text-amber-400" :
              "text-slate-500"
          }`}>
          {subtext}
        </span>
      </div>
      <div>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <h3 className="text-3xl font-extrabold text-white mt-1">{value}</h3>
      </div>
    </div>
  )
}

export default DriverDashboard;
