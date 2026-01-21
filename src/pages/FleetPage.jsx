import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react"; // Import icon
import { fetchMatatus, addVehicle, updateVehicle, deleteVehicle } from "../api/matatus";
import { fetchRoutes } from "../api/routes";
import { fetchDrivers } from "../api/users";
import Modal from "../components/common/Modal";

export default function FleetPage() {
    const [vehicles, setVehicles] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [vehicleForm, setVehicleForm] = useState({
        plate_number: "",
        capacity: 14,
        route_id: "",
        driver_id: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // vehicles
            const resVehicles = await fetchMatatus();
            console.log("Vehicles:", resVehicles);
            const vehicleList = resVehicles.data?.data || resVehicles.data || [];
            setVehicles(Array.isArray(vehicleList) ? vehicleList : []);

            // routes
            const resRoutes = await fetchRoutes();
            console.log("Routes Response:", resRoutes);
            console.log("Routes Response.data:", resRoutes.data);
            console.log("Routes Response.data.data:", resRoutes.data?.data);
            // routes endpoint returns { data: [...] } via success_response
            const routeList = resRoutes.data?.data || resRoutes.data || [];
            console.log("Parsed Route List:", routeList);
            console.log("Is Array?:", Array.isArray(routeList));
            setRoutes(Array.isArray(routeList) ? routeList : []);

            // drivers
            const resDrivers = await fetchDrivers();
            console.log("Drivers Response:", resDrivers);
            console.log("Drivers Response.data:", resDrivers.data);
            // drivers endpoint returns pure list [...]
            const driverList = Array.isArray(resDrivers.data) ? resDrivers.data : (resDrivers.data?.data || []);
            console.log("Parsed Driver List:", driverList);
            setAvailableDrivers(Array.isArray(driverList) ? driverList : []);
        } catch (err) {
            console.error("Error loading fleet data", err);
        }
    };

    const handleUpdateVehicle = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                capacity: selectedVehicle.capacity,
                route_id: selectedVehicle.route_id ? parseInt(selectedVehicle.route_id) : null,
                driver_id: selectedVehicle.driver_id ? parseInt(selectedVehicle.driver_id) : null,
            };
            await updateVehicle(selectedVehicle.id, payload);
            alert("Vehicle Updated!");
            setIsEditing(false);
            setSelectedVehicle(null);
            loadData();
        } catch (err) {
            console.error("Update failed", err);
            alert("Update failed: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            await deleteVehicle(id);
            alert("Vehicle Deleted");
            setSelectedVehicle(null);
            loadData();
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed");
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!vehicleForm.plate_number) throw new Error("Plate number required");

            const payload = {
                ...vehicleForm,
                route_id: vehicleForm.route_id ? parseInt(vehicleForm.route_id) : null,
                driver_id: vehicleForm.driver_id ? parseInt(vehicleForm.driver_id) : null,
            };

            await addVehicle(payload);
            alert("Vehicle Added Successfully!");
            setShowModal(false);
            setVehicleForm({ ...vehicleForm, plate_number: "", driver_id: "", route_id: "" });
            loadData();
        } catch (err) {
            console.error("Failed to add vehicle:", err);
            alert("Failed to add vehicle: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mc-shell space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="mc-h1">Fleet Management</h1>
                    <p className="mc-muted">Manage your vehicles and their status.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search fleet..."
                            className="mc-input pl-10 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mc-btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Vehicle
                    </button>
                </div>
            </div>

            <div className="mc-table-container">
                <table className="mc-table">
                    <thead>
                        <tr>
                            <th>Number Plate</th>
                            <th>Capacity</th>
                            <th>Route</th>
                            <th>Driver</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.filter(v =>
                            v.plate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (v.driver && v.driver.toLowerCase().includes(searchQuery.toLowerCase()))
                        ).map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td className="font-bold text-white font-mono">{vehicle.plate_number}</td>
                                <td>{vehicle.capacity} Seats</td>
                                <td>
                                    {vehicle.route ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            {vehicle.route.name || `${vehicle.route.origin}-${vehicle.route.destination}`}
                                        </span>
                                    ) : (
                                        <span className="text-slate-600 italic">Unassigned</span>
                                    )}
                                </td>
                                <td>
                                    {vehicle.driver ? (
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-medium">{vehicle.driver}</span>
                                            {vehicle.driver_id && <span className="text-[10px] text-slate-500">ID: {vehicle.driver_id}</span>}
                                        </div>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-slate-500">No Driver</span>
                                    )}
                                </td>
                                <td>
                                    <span className={`mc-badge ${vehicle.assignment_status === "active"
                                        ? "mc-badge-success"
                                        : "mc-badge-warning"
                                        }`}>
                                        {vehicle.assignment_status || "Active"}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => setSelectedVehicle(vehicle)}
                                        className="mc-link text-xs uppercase font-bold tracking-wider"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {vehicles.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-12 text-slate-500">
                                    No vehicles found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* VIEW / EDIT VEHICLE MODAL */}
            {selectedVehicle && (
                <Modal title={isEditing ? `Edit Vehicle` : `Vehicle Details`} onClose={() => { setSelectedVehicle(null); setIsEditing(false); }}>
                    {isEditing ? (
                        <form onSubmit={handleUpdateVehicle} className="space-y-5">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Vehicle</p>
                                <p className="text-xl font-bold text-white font-mono">{selectedVehicle.plate_number}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mc-label">Capacity</label>
                                    <input
                                        type="number"
                                        className="mc-input"
                                        value={selectedVehicle.capacity}
                                        onChange={e => setSelectedVehicle({ ...selectedVehicle, capacity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="mc-label">Route</label>
                                    <select
                                        className="mc-input appearance-none"
                                        value={selectedVehicle.route_id || ""}
                                        onChange={e => setSelectedVehicle({ ...selectedVehicle, route_id: e.target.value })}
                                    >
                                        <option value="">-- Unassigned --</option>
                                        {routes.map(r => (
                                            <option key={r.id} value={r.id}>{r.name || r.origin + " - " + r.destination}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mc-label">Driver</label>
                                <select
                                    className="mc-input appearance-none"
                                    value={selectedVehicle.driver_id || ""}
                                    onChange={e => setSelectedVehicle({ ...selectedVehicle, driver_id: e.target.value })}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {availableDrivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsEditing(false)} className="mc-btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button disabled={isSubmitting} className="mc-btn-primary flex-1">
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <div>
                                    <p className="text-xs text-emerald-400 font-bold uppercase mb-1">Status</p>
                                    <span className={`mc-badge ${selectedVehicle.assignment_status === "active"
                                        ? "mc-badge-success"
                                        : "mc-badge-warning"
                                        }`}>
                                        {selectedVehicle.assignment_status || "Active"}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-emerald-400 font-bold uppercase mb-1">Plate Number</p>
                                    <p className="text-2xl font-bold text-white font-mono">{selectedVehicle.plate_number}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-surface-light rounded-xl border border-white/5">
                                    <p className="mc-label">Driver</p>
                                    <p className="text-white font-medium text-lg">{selectedVehicle.driver || "Unassigned"}</p>
                                    {selectedVehicle.driver_id && <p className="text-xs text-slate-500 mt-1">ID: {selectedVehicle.driver_id}</p>}
                                </div>
                                <div className="p-4 bg-surface-light rounded-xl border border-white/5">
                                    <p className="mc-label">Route</p>
                                    <p className="text-white font-medium text-lg">{selectedVehicle.route ? (selectedVehicle.route.name || `${selectedVehicle.route.origin}-${selectedVehicle.route.destination}`) : "Unassigned"}</p>
                                </div>
                                <div className="p-4 bg-surface-light rounded-xl border border-white/5">
                                    <p className="mc-label">Capacity</p>
                                    <p className="text-white font-medium text-lg">{selectedVehicle.capacity} Seats</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-6 border-t border-white/5">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mc-btn-secondary flex-1"
                                >
                                    Edit Details
                                </button>
                                <button
                                    onClick={() => handleDeleteVehicle(selectedVehicle.id)}
                                    className="mc-btn-danger flex-1"
                                >
                                    Delete Vehicle
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            {/* ADD VEHICLE MODAL */}
            {showModal && (
                <Modal title="Register New Vehicle" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleAddVehicle} className="space-y-5">
                        <div className="bg-surface-light p-4 rounded-xl border border-white/5">
                            <label className="mc-label">Plate Number</label>
                            <input
                                className="mc-input uppercase font-mono tracking-widest text-lg"
                                placeholder="KDA 123Z"
                                value={vehicleForm.plate_number}
                                onChange={e => setVehicleForm({ ...vehicleForm, plate_number: e.target.value.toUpperCase() })}
                            />
                            <p className="text-[10px] text-slate-500 mt-2 font-medium">Format: KAA 123B (Standard Kenyan Plate)</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mc-label">Capacity</label>
                                <input
                                    type="number"
                                    className="mc-input"
                                    value={vehicleForm.capacity}
                                    onChange={e => setVehicleForm({ ...vehicleForm, capacity: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="mc-label">Route</label>
                                <select
                                    className="mc-input appearance-none"
                                    value={vehicleForm.route_id}
                                    onChange={e => setVehicleForm({ ...vehicleForm, route_id: e.target.value })}
                                >
                                    <option value="">-- Select Route --</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id}>{r.name || r.origin + " - " + r.destination}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mc-label">Driver (Optional)</label>
                            <select
                                className="mc-input appearance-none"
                                value={vehicleForm.driver_id}
                                onChange={e => setVehicleForm({ ...vehicleForm, driver_id: e.target.value })}
                            >
                                <option value="">-- Assign Driver --</option>
                                {availableDrivers.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                                ))}
                            </select>
                        </div>
                        <button disabled={isSubmitting} className="mc-btn-primary w-full mt-4 py-3">
                            {isSubmitting ? "Registering..." : "Register Vehicle"}
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}
