import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, UserGroupIcon, CurrencyDollarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const MatatuCard = ({ matatu }) => {
    const navigate = useNavigate();

    // Formatting currency (KES) as per your role's focus
    const formattedFare = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
    }).format(matatu.fare);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 group shadow-lg">
            {/* Top Section: Image & Badge */}
            <div className="relative h-32 bg-slate-800 overflow-hidden">
                {/* Image handled by Person 2/Cloudinary - Using placeholder for now */}
                <img 
                    src={matatu.image_url || "https://via.placeholder.com/400x200?text=Matatu+Connect"} 
                    alt={matatu.registration_number}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                        {matatu.sacco_name}
                    </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded text-white font-mono text-xs font-bold">
                    {matatu.registration_number}
                </div>
            </div>

            {/* Bottom Section: Info & Action */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{matatu.route_name}</h3>
                        <div className="flex items-center text-slate-400 text-xs mt-1">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            <span>Departure: {matatu.departure_point}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-green-500 font-black text-lg leading-tight">{formattedFare}</p>
                        <p className="text-slate-500 text-[10px] uppercase">Per Seat</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-slate-400 text-xs">
                            <UserGroupIcon className="w-4 h-4 mr-1 text-slate-500" />
                            <span>{matatu.available_seats} left</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate(`/matatu/${matatu.id}`)}
                        className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-1 transition-colors"
                    >
                        Book Now
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatatuCard;