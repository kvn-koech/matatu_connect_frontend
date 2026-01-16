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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
        <div className="mc-card w-full max-w-lg p-8 text-center animate-in zoom-in duration-300 border-red-500/20">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Not Active</h2>
          <p className="text-text-muted mb-6">
            You are not currently assigned to any Sacco. <br />
            Please contact your Sacco Manager to verify your account and add you to the fleet.
          </p>
          <button onClick={logout} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
            Logout
          </button>
        </div>
      </div>
    );
  }

  // NO VEHICLE ASSIGNED
  if (!myVehicle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
        <div className="mc-card w-full max-w-lg p-8 text-center animate-in zoom-in duration-300 border-yellow-500/20">
          <div className="w-16 h-16 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Waiting for Assignment</h2>
          <p className="text-text-muted mb-6">
            You are signed in, but not yet assigned to a vehicle. <br />
            Wait for your Sacco Manager to assign a Matatu to you.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold transition-colors">
              Refresh Status
            </button>
            <button onClick={logout} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
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
        <div className="mc-card w-full max-w-lg p-8 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">New Vehicle Assignment</h2>
          <p className="text-text-muted mb-6">
            You have been assigned to drive <strong className="text-white">{myVehicle.plate_number}</strong>.
            <br />
            Capacity: {myVehicle.capacity || 14} Passengers.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="py-3 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" /> Reject
            </button>
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Driver"}! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-text-muted mt-1">
            {myVehicle ? (
              <span className="flex items-center gap-2">
                Vehicle: <span className="text-white font-mono bg-white/10 px-2 rounded">{myVehicle.plate_number}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">Active</span>
              </span>
            ) : "No vehicle assigned currently."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-surface border border-white/10 text-white hover:bg-white/10 relative"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-surface-dark"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-dark border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-white/10 flex justify-between items-center">
                  <h4 className="font-bold text-white">Notifications</h4>
                  <span className="text-xs text-text-muted">{notifications.filter(n => !n.is_read).length} new</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-text-muted text-center">No notifications</p>
                  ) : (
                    notifications.map(note => (
                      <div
                        key={note.id}
                        className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer ${!note.is_read ? 'bg-emerald-500/5' : ''}`}
                        onClick={() => handleRead(note.id)}
                      >
                        <p className={`text-sm ${!note.is_read ? 'text-white font-bold' : 'text-text-muted'}`}>
                          {note.message}
                        </p>
                        <p className="text-[10px] text-text-muted mt-1">{new Date(note.created_at).toLocaleString()}</p>
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
                  flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-bold text-sm
                  ${bookings.filter(b => b.status === "confirmed").length > 0
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                  : "bg-surface border-white/10 text-text-muted cursor-not-allowed opacity-50"
                }
                `}
            >
              {isCompletingTrip ? <span className="animate-spin">⌛</span> : <Flag className="w-4 h-4 fill-current" />}
              {isCompletingTrip ? "Finishing..." : "End Trip"}
            </button>
          )}

          {/* Online Toggle */}
          {/* Online Toggle */}
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer select-none
            ${online ? "bg-emerald-500/10 border-emerald-500/50" : "bg-surface border-white/10"}
          `} onClick={() => setOnline(!online)}>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${online ? "bg-emerald-500" : "bg-slate-600"}`}>
              <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${online ? "translate-x-4" : ""}`} />
            </div>
            <p className={`font-bold text-sm ${online ? "text-emerald-400" : "text-slate-400"}`}>
              {online ? "Online" : "Offline"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                console.log("Opening Log Modal");
                setShowLogModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white border border-purple-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold text-sm shadow-md"
            >
              <Clock className="w-4 h-4" />
              Log Stats
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* EARNINGS CARD (Big Green) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="font-medium opacity-80 mb-1">Today's Earnings</p>
              <h2 className="text-5xl font-bold mb-4">
                <h2 className="text-5xl font-bold mb-4">
                  KES {bookings.reduce((sum, b) => {
                    const isToday = new Date(b.booking_date).toDateString() === new Date().toDateString();
                    return sum + ((b.payment_status === 'completed' && isToday) ? (b.payment_amount || 0) : 0);
                  }, 0).toLocaleString()}
                </h2>
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/10 rounded-full text-xs font-semibold">
                <span>📈 Real-time</span>
              </div>
              <span className="text-xs opacity-60 ml-3">Updated {timeAgo}</span>
            </div>
            <div className="p-3 bg-black/10 rounded-2xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* SIDE STATS */}
        <div className="space-y-6">
          <StatCard
            icon={<Clock className="w-5 h-5 text-yellow-400" />}
            label="Hours Online"
            value={onlineDuration}
            subtext={online ? "Tracking time..." : "Offline"}
          />
          <StatCard
            icon={<Navigation className="w-5 h-5 text-emerald-400" />}
            label="Trips Today"
            value={bookings.length.toString()}
            subtext="Total Passengers"
          />
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* COLUMN 1: Pending & Upcoming */}
        <div className="space-y-6">
          {/* PENDING BOOKINGS */}
          {bookings.filter(b => b.status === 'pending').length > 0 && (
            <div className="bg-surface-dark rounded-3xl p-6 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-500 animate-pulse" />
                  New Requests
                </h3>
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold">
                  {bookings.filter(b => b.status === 'pending').length} Pending
                </span>
              </div>
              <div className="space-y-3">
                {bookings.filter(b => b.status === 'pending').map(booking => (
                  <div key={booking.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{booking.user_name}</p>
                        <p className="text-xs text-text-muted">Seat: {booking.seat_number} • {booking.payment_status}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBookingAction(booking.id, 'reject')}
                          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'accept')}
                          className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
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
                        className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-blue-500/20"
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
          <div className="bg-surface-dark rounded-3xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Upcoming Pickups</h3>
              <button className="text-emerald-400 text-sm font-semibold hover:underline">View All</button>
            </div>

            <div className="space-y-1">
              {upcomingPickups.map((pickup, idx) => (
                <div key={pickup.id} className={`p-4 rounded-2xl transition-all ${pickup.type === "next"
                  ? "bg-emerald-500/10 border border-emerald-500/20 mb-4"
                  : "hover:bg-white/5 border border-transparent"
                  }`}>
                  {pickup.type === "next" && (
                    <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-emerald-400">Next Stop</span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{pickup.time} away</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={pickup.avatar} alt={pickup.name} className="w-10 h-10 rounded-full object-cover border-2 border-surface" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-sm">{pickup.name}</p>
                          {pickup.status && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${pickup.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-yellow-500/20 text-yellow-500'
                              }`}>
                              {pickup.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {pickup.location}
                          {pickup.seatNumber && <span className="ml-2">• Seat {pickup.seatNumber}</span>}
                        </div>
                      </div>
                    </div>

                    {pickup.type === "next" ? (
                      <button className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-400 transition-colors">
                        Arrived
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-text-muted">{pickup.time}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* END COLUMN 1 */}

        {/* COLUMN 2: SEAT LAYOUT & ROUTE PREVIEW */}
        <div className="space-y-6"> {/* This div now correctly represents the second column */}
          {/* SEAT LAYOUT */}
          <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Seat Layout</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div> Occupied</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/50"></div> Pending</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white/5 border border-white/10"></div> Available</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black/20 rounded-2xl border border-white/5">
              {/* Driver Seat Row */}
              <div className="w-full flex justify-end mb-8 border-b border-dashed border-white/10 pb-4">
                <div className="w-12 h-12 rounded-lg border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Passenger Seats Grid */}
              <div className="grid grid-cols-4 gap-4 w-full max-w-xs">
                {Array.from({ length: myVehicle?.capacity || 14 }).map((_, i) => {
                  const seatNum = (i + 1).toString();
                  // Find active booking for this seat (excluding rejected)
                  const booking = bookings.find(b => String(b.seat_number) === seatNum && b.status !== 'rejected');

                  // Debug for seat 1
                  if (i === 0) {
                    console.log("Seat 1 Debug:", { seatNum, foundBooking: booking, allBookings: bookings });
                  }

                  const isConfirmed = booking?.status === 'confirmed';
                  const isPending = booking?.status === 'pending';

                  return (
                    <div
                      key={i}
                      className={`
                                        aspect-square rounded-lg flex items-center justify-center text-sm font-bold border transition-all
                                        ${isConfirmed
                          ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" // Occupied
                          : isPending
                            ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400 animate-pulse" // Pending Request
                            : "bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:border-white/20" // Available
                        }
                                    `}
                      title={booking ? `${booking.user_name} (${booking.status})` : "Available"}
                    >
                      {seatNum}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-text-muted">
                  <span className="text-white font-bold">{bookings.filter(b => b.status === 'confirmed').length}</span> / {myVehicle?.capacity || 14} Seats Occupied
                </p>
              </div>
            </div>
          </div>

          {/* MAP / ROUTE PREVIEW */}
          <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Route Preview</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white"><Search className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[300px]">
              {/* Map Component */}
              {myVehicle ? (
                <LiveMap vehicles={[myVehicle]} centerVehicle={myVehicle} />
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  <p>No active vehicle assigned to track.</p>
                </div>
              )}

              {/* Traffic Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Heavy Traffic</p>
                  <p className="text-xs text-text-muted mt-0.5">Expected delay: +5 mins on Waiyaki Way</p>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="mc-card w-full max-w-sm animate-in zoom-in duration-200">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wallet className="text-emerald-400" /> Request Payment
                </h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-text-muted hover:text-white">✕</button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 mb-4">
                  <p className="text-sm text-emerald-400 font-bold mb-1">Passenger</p>
                  <p className="text-white">{selectedBookingForPayment?.user_name}</p>
                </div>

                <div>
                  <label className="mc-label">M-Pesa Phone Number</label>
                  <input
                    name="phone"
                    placeholder="0712345678"
                    className="mc-input"
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
                    className="mc-input"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                  />
                </div>

                <button
                  disabled={isSendingPayment}
                  className="mc-btn-primary w-full py-3 flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <div className="mc-card w-full max-w-sm animate-in zoom-in duration-200 border border-purple-500/30">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-purple-400" /> Log Daily Stats
              </h2>
              <button onClick={() => setShowLogModal(false)} className="text-text-muted hover:text-white">✕</button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
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
                className="mc-btn-primary w-full py-3 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 border-purple-600"
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
function StatCard({ icon, label, value, subtext }) {
  return (
    <div className="bg-surface-dark rounded-3xl p-5 border border-white/5 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm text-text-muted font-medium">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-lg inline-block">
          {subtext}
        </p>
      </div>
    </div>
  )
}

export default DriverDashboard;
