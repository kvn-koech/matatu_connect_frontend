import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react"; // Import icon
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

    const [vehicleForm, setVehicleForm] = useState({
        plate_number: "",
        capacity: 14,
        route_id: "",
        driver_id: "",
        sacco_id: 1
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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
                    <p className="text-text-muted">Manage your vehicles and their status.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="mc-btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Vehicle
                </button>
            </div>

            <div className="bg-surface-dark rounded-2xl p-6 shadow-lg">
                <table className="w-full text-left text-sm text-text-muted">
                    <thead className="border-b border-white/10 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="py-4">Number Plate</th>
                            <th className="py-4">Capacity</th>
                            <th className="py-4">Route</th>
                            <th className="py-4">Driver</th>
                            <th className="py-4">Status</th>
                            <th className="py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 font-medium text-white">{vehicle.plate_number}</td>
                                <td className="py-4">{vehicle.capacity}</td>
                                <td className="py-4">{vehicle.route ? (vehicle.route.name || `${vehicle.route.origin}-${vehicle.route.destination}`) : "Unassigned"}</td>
                                <td className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm">{vehicle.driver || "Unassigned"}</span>
                                        {vehicle.driver_id && <span className="text-xs text-text-muted">ID: {vehicle.driver_id}</span>}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${vehicle.assignment_status === "active"
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {vehicle.assignment_status || "Active"}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <button
                                        onClick={() => setSelectedVehicle(vehicle)}
                                        className="text-primary hover:text-emerald-300 text-xs font-semibold"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* VIEW / EDIT VEHICLE MODAL */}
            {selectedVehicle && (
                <Modal title={isEditing ? `Edit Vehicle: ${selectedVehicle.plate_number}` : `Vehicle Details: ${selectedVehicle.plate_number}`} onClose={() => { setSelectedVehicle(null); setIsEditing(false); }}>
                    {isEditing ? (
                        <form onSubmit={handleUpdateVehicle} className="space-y-4">
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
                                        className="mc-input bg-slate-900 appearance-none"
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
                                    className="mc-input bg-slate-900 appearance-none"
                                    value={selectedVehicle.driver_id || ""}
                                    onChange={e => setSelectedVehicle({ ...selectedVehicle, driver_id: e.target.value })}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {availableDrivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10">
                                    Cancel
                                </button>
                                <button disabled={isSubmitting} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors">
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                <div>
                                    <p className="text-sm text-text-muted">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedVehicle.assignment_status === "active"
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {selectedVehicle.assignment_status || "Active"}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-text-muted">Capacity</p>
                                    <p className="text-xl font-bold text-white">{selectedVehicle.capacity} Seats</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Assignment Info</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-surface-dark rounded-lg">
                                            <p className="text-xs text-text-muted">Driver</p>
                                            <p className="text-white font-medium">{selectedVehicle.driver || "Unassigned"}</p>
                                            {selectedVehicle.driver_id && <p className="text-[10px] text-text-muted">ID: {selectedVehicle.driver_id}</p>}
                                        </div>
                                        <div className="p-3 bg-surface-dark rounded-lg">
                                            <p className="text-xs text-text-muted">Route</p>
                                            <p className="text-white font-medium">{selectedVehicle.route ? (selectedVehicle.route.name || `${selectedVehicle.route.origin}-${selectedVehicle.route.destination}`) : "Unassigned"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Data - Hidden until Real Log Integration */}
                                {/* 
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Performance (Mock)</h4>
                                    <div className="p-3 bg-surface-dark rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-text-muted">Daily Revenue</p>
                                            <p className="text-white font-bold">KES 12,500</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted">Fuel Efficiency</p>
                                            <p className="text-white font-bold">8.2 km/L</p>
                                        </div>
                                    </div>
                                </div> 
                                */}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteVehicle(selectedVehicle.id)}
                                    className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            {/* ADD VEHICLE MODAL */}
            {showModal && (
                <Modal title="Register New Vehicle" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleAddVehicle} className="space-y-4">
                        <div>
                            <label className="mc-label">Plate Number</label>
                            <input
                                className="mc-input uppercase"
                                placeholder="KDA 123Z"
                                value={vehicleForm.plate_number}
                                onChange={e => setVehicleForm({ ...vehicleForm, plate_number: e.target.value.toUpperCase() })}
                            />
                            <p className="text-xs text-text-muted mt-1">Format: KAA 123B (Standard Kenyan Plate)</p>
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
                                    className="mc-input bg-slate-900 appearance-none"
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
                                className="mc-input bg-slate-900 appearance-none"
                                value={vehicleForm.driver_id}
                                onChange={e => setVehicleForm({ ...vehicleForm, driver_id: e.target.value })}
                            >
                                <option value="">-- Assign Driver --</option>
                                {availableDrivers.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                                ))}
                            </select>
                        </div>
                        <button disabled={isSubmitting} className="mc-btn-primary w-full mt-4">
                            {isSubmitting ? "Registering..." : "Register Vehicle"}
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}
