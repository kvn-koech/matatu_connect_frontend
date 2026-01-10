import React from "react";

export default function DriversPage() {
    const drivers = [
        { id: 101, name: "John Kamau", rating: 4.8, status: "On Trip", phone: "+254 712 345 678" },
        { id: 102, name: "Peter Omondi", rating: 4.5, status: "Idle", phone: "+254 722 987 654" },
        { id: 103, name: "Samuel Njoroge", rating: 4.9, status: "On Trip", phone: "+254 733 111 222" },
        { id: 104, name: "Esther Wanjiku", rating: 4.7, status: "On Leave", phone: "+254 799 555 444" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Drivers</h1>
                    <p className="text-text-muted">Manage driver profiles and performance.</p>
                </div>
                <button className="mc-btn-primary">
                    + Add Driver
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <div key={driver.id} className="mc-card p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-lg font-bold">
                                    {driver.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{driver.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-text-muted">
                                        <span className="text-yellow-400">★</span> {driver.rating} Rating
                                    </div>
                                </div>
                            </div>
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${driver.status === "On Trip" ? "border-emerald-500/30 text-emerald-400" :
                                    driver.status === "Idle" ? "border-yellow-500/30 text-yellow-500" :
                                        "border-red-500/30 text-red-500"
                                }`}>
                                {driver.status}
                            </span>
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-auto">
                            <p className="text-xs text-text-muted mb-3">Contact: {driver.phone}</p>
                            <button className="w-full py-2 rounded-lg bg-surface hover:bg-white/5 text-sm font-medium transition-colors border border-white/5">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
