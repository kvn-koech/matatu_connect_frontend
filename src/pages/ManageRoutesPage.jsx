import React from "react";

export default function ManageRoutesPage() {
    const routes = [
        { id: 1, name: "Route 1: CBD - Westlands", revenue: "KES 45,000", vehicles: 12 },
        { id: 2, name: "Route 2: CBD - Thika Road", revenue: "KES 82,000", vehicles: 24 },
        { id: 3, name: "Route 3: CBD - Ngong Road", revenue: "KES 38,000", vehicles: 8 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Route Management</h1>
                    <p className="text-text-muted">Optimize routes and track revenue.</p>
                </div>
                <button className="mc-btn-primary">
                    + Optimize Routes
                </button>
            </div>

            <div className="grid gap-4">
                {routes.map((route) => (
                    <div key={route.id} className="mc-card p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                {route.id}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">{route.name}</h3>
                                <p className="text-sm text-text-muted">{route.vehicles} Vehicles assigned</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-text-muted">Daily Revenue</p>
                            <p className="text-xl font-bold text-white">{route.revenue}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
