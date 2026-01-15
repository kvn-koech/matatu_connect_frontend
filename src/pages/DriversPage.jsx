import React, { useState, useEffect } from "react";
import { fetchDrivers, inviteDriver, searchDriver, updateDriverStatus, assignRoute } from "../api/users";
import { fetchRoutes } from "../api/routes";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, User, Mail, Phone, MoreVertical } from "lucide-react";

export default function DriversPage() {
    const { user } = useAuth();
    const [drivers, setDrivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("invite"); // 'invite' or 'create'
    const [inviteEmail, setInviteEmail] = useState("");
    const [foundDriver, setFoundDriver] = useState(null); // Result from search
    const [newDriverForm, setNewDriverForm] = useState({ name: "", email: "", password: "", role: "driver" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Profile & Assignment State
    const [viewDriver, setViewDriver] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [selectedRouteId, setSelectedRouteId] = useState("");

    useEffect(() => {
        loadDrivers();
        loadRoutes();
    }, []);

    const loadDrivers = async () => {
        try {
            const res = await fetchDrivers();
            // Ensure array
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setDrivers(data);
        } catch (err) {
            console.error("Failed to load drivers", err);
        }
    };

    const loadRoutes = async () => {
        try {
            const res = await fetchRoutes();
            setRoutes(res.data.data || res.data || []);
        } catch (err) {
            console.error("Failed to load routes", err);
        }
    };

    const handleStatusUpdate = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this driver?`)) return;
        try {
            await updateDriverStatus(id, action);
            alert(`Driver ${action}d successfully`);
            loadDrivers();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFoundDriver(null);
        try {
            const res = await searchDriver(inviteEmail);
            setFoundDriver(res.data.data);
        } catch (err) {
            alert("Search failed: " + (err.response?.data?.error || "Driver not found"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInvite = async () => {
        setIsSubmitting(true);
        try {
            await inviteDriver(inviteEmail); // or foundDriver.email
            alert("Driver added to Sacco successfully!");
            setInviteEmail("");
            setFoundDriver(null);
            setShowModal(false);
            loadDrivers();
        } catch (err) {
            alert("Failed to invite: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await registerUser({
                ...newDriverForm,
                role: "driver",
                sacco_id: user?.sacco_id, // Link to Manager's Sacco
                verification_status: "approved" // Auto-approve since Manager created it
            });
            alert("New Driver Created Successfully!");
            setNewDriverForm({ name: "", email: "", password: "", role: "driver" });
            setShowModal(false);
            loadDrivers();
        } catch (err) {
            alert("Failed to create: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignRoute = async () => {
        if (!viewDriver || !selectedRouteId) return;
        setIsSubmitting(true);
        try {
            await assignRoute(viewDriver.id, selectedRouteId);
            alert("Route assigned successfully! Driver will be notified.");
            setViewDriver(null);
            loadDrivers(); // Refresh data
        } catch (err) {
            console.error(err);
            alert("Failed to assign route: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Drivers</h1>
                    <p className="text-text-muted">Manage your fleet drivers ({drivers.length})</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                >
                    <Plus size={20} /> Add Driver
                </button>
            </div>

            {/* Drivers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <div key={driver.id} className="mc-card p-6 flex flex-col gap-4 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-white/10 rounded"><MoreVertical size={16} className="text-text-muted" /></button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xl font-bold text-emerald-400">
                                {driver.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{driver.name}</h3>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${driver.verification_status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                        driver.verification_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-500 animate-pulse'
                                        }`}>
                                        {driver.verification_status || 'Approved'}
                                    </span>
                                    <span className="text-text-muted">ID: {driver.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mt-2">
                            {driver.license_number && (
                                <div className="flex items-center gap-3 text-sm text-text-muted p-2 bg-white/5 rounded-lg border border-dashed border-white/10">
                                    <span className="text-xs font-bold text-white">LICENCE:</span>
                                    <span className="truncate font-mono">{driver.license_number}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-text-muted p-2 bg-white/5 rounded-lg">
                                <Mail size={16} />
                                <span className="truncate">{driver.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-muted p-2 bg-white/5 rounded-lg">
                                <Phone size={16} />
                                <span>No phone linked</span>
                            </div>

                            {/* Assigned Matatu Info */}
                            <div className="p-3 bg-surface-dark rounded-lg mt-2 border border-white/5">
                                <p className="text-xs font-bold text-text-muted uppercase mb-1">Current Assignment</p>
                                {driver.assigned_vehicle ? (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-white font-bold">{driver.assigned_vehicle}</p>
                                            <p className="text-xs text-emerald-400">{driver.assigned_route || "No Route"}</p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-text-muted italic">No active vehicle assigned</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                            {driver.verification_status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(driver.id, 'approve')}
                                        className="flex-1 py-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(driver.id, 'reject')}
                                        className="flex-1 py-2 text-sm font-bold bg-white/5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                    >
                                        Reject
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-2 w-full">
                                    <button
                                        onClick={() => setViewDriver(driver)}
                                        className="flex-1 py-2 text-sm font-semibold bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors">
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(driver.id, 'dismiss')}
                                        className="py-2 px-3 text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10"
                                        title="Dismiss Driver from Sacco"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {drivers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-text-muted bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <User size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No drivers found in your Sacco.</p>
                        <button onClick={() => setShowModal(true)} className="text-emerald-400 hover:underline mt-2">Add your first driver</button>
                    </div>
                )}
            </div>

            {/* ADD DRIVER MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="mc-card w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Add Driver</h2>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white">✕</button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('invite')}
                                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'invite' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/5' : 'text-text-muted hover:text-white'}`}
                            >
                                Existing Account
                            </button>
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'create' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/5' : 'text-text-muted hover:text-white'}`}
                            >
                                Register New
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {activeTab === 'invite' ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-text-muted">
                                        Enter the email of an existing driver to verify their details before adding them.
                                    </p>

                                    {!foundDriver ? (
                                        <form onSubmit={handleSearch} className="space-y-4">
                                            <div>
                                                <label className="mc-label">Driver Email</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        required
                                                        className="mc-input flex-1"
                                                        placeholder="driver@example.com"
                                                        value={inviteEmail}
                                                        onChange={e => setInviteEmail(e.target.value)}
                                                    />
                                                    <button disabled={isSubmitting} className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
                                                        {isSubmitting ? "..." : <Search size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <button disabled={isSubmitting} className="mc-btn-primary w-full py-3">
                                                {isSubmitting ? "Searching..." : "Verify Driver"}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="p-4 bg-surface-dark border border-white/10 rounded-xl space-y-3">
                                                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                                        {foundDriver.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold">{foundDriver.name}</h4>
                                                        <p className="text-sm text-text-muted">{foundDriver.email}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-text-muted text-xs uppercase">License Info</p>
                                                        <p className="text-white font-mono">{foundDriver.license_number || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-text-muted text-xs uppercase">Verification</p>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${foundDriver.verification_status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                            {foundDriver.verification_status || "Pending"}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-text-muted text-xs uppercase">Current Sacco</p>
                                                        <p className="text-white">{foundDriver.sacco_id ? `Assigned (ID: ${foundDriver.sacco_id})` : "Unassigned - Ready to join"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setFoundDriver(null)}
                                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleInvite}
                                                    disabled={isSubmitting}
                                                    className="flex-1 py-3 mc-btn-primary"
                                                >
                                                    {isSubmitting ? "Adding..." : "Add to Sacco"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label className="mc-label">Full Name</label>
                                        <input
                                            required
                                            className="mc-input"
                                            placeholder="John Doe"
                                            value={newDriverForm.name}
                                            onChange={e => setNewDriverForm({ ...newDriverForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mc-label">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="mc-input"
                                            placeholder="john@example.com"
                                            value={newDriverForm.email}
                                            onChange={e => setNewDriverForm({ ...newDriverForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="mc-label">Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="mc-input"
                                            placeholder="••••••••"
                                            value={newDriverForm.password}
                                            onChange={e => setNewDriverForm({ ...newDriverForm, password: e.target.value })}
                                        />
                                    </div>
                                    <button disabled={isSubmitting} className="mc-btn-primary w-full py-3">
                                        {isSubmitting ? "Creating..." : "Create & Add Driver"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW PROFILE & ASSIGN ROUTE MODAL */}
            {viewDriver && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="mc-card w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-dark">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <User className="text-emerald-400" /> Driver Profile
                            </h2>
                            <button onClick={() => setViewDriver(null)} className="text-text-muted hover:text-white">✕</button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Driver Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold border border-emerald-500/50">
                                    {viewDriver.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{viewDriver.name}</h3>
                                    <p className="text-text-muted">{viewDriver.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {viewDriver.verification_status}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/5 text-white border border-white/10">
                                            Driver ID: {viewDriver.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <p className="text-xs text-text-muted uppercase mb-1">License Number</p>
                                    <p className="text-white font-mono">{viewDriver.license_number || "Not Provided"}</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <p className="text-xs text-text-muted uppercase mb-1">Assigned Vehicle</p>
                                    <p className="text-white font-bold">{viewDriver.assigned_vehicle || "None"}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-surface-dark rounded-xl border border-dashed border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="font-bold text-white">Route Assignment</p>
                                    {viewDriver.assigned_route && (
                                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                            Currently: {viewDriver.assigned_route}
                                        </span>
                                    )}
                                </div>

                                {viewDriver.assigned_vehicle ? (
                                    <div className="flex gap-2">
                                        <select
                                            className="mc-input flex-1 bg-black/50"
                                            value={selectedRouteId}
                                            onChange={(e) => setSelectedRouteId(e.target.value)}
                                        >
                                            <option value="">-- Select New Route --</option>
                                            {routes.map(r => (
                                                <option key={r.id} value={r.id}>
                                                    {r.origin} - {r.destination} ({r.distance ? `${r.distance}km` : 'N/A'})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAssignRoute}
                                            disabled={isSubmitting || !selectedRouteId}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? "..." : "Assign"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                        <p className="text-yellow-500 text-sm">Assign a vehicle to this driver before assigning a route.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

