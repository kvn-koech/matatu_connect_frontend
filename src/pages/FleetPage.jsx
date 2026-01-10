import React from "react";

export default function FleetPage() {
    const fleetData = [
        { id: 1, plate: "KBC 123A", status: "Active", driver: "John Doe", type: "33 Seater" },
        { id: 2, plate: "KDA 456B", status: "Maintenance", driver: "Jane Smith", type: "14 Seater" },
        { id: 3, plate: "KAZ 789C", status: "Active", driver: "Mike Johnson", type: "33 Seater" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
                    <p className="text-text-muted">Manage your vehicles and their status.</p>
                </div>
                <button className="mc-btn-primary">
                    + Add Vehicle
                </button>
            </div>

            <div className="bg-surface-dark rounded-2xl p-6 shadow-lg">
                <table className="w-full text-left text-sm text-text-muted">
                    <thead className="border-b border-white/10 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="py-4">Number Plate</th>
                            <th className="py-4">Type</th>
                            <th className="py-4">Driver</th>
                            <th className="py-4">Status</th>
                            <th className="py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {fleetData.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 font-medium text-white">{vehicle.plate}</td>
                                <td className="py-4">{vehicle.type}</td>
                                <td className="py-4">{vehicle.driver}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${vehicle.status === "Active"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {vehicle.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <button className="text-primary hover:text-emerald-300 text-xs font-semibold">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
