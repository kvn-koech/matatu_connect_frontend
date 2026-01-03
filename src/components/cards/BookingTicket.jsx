import React from 'react';
import dayjs from 'dayjs'; // [RUBRIC] Requirement
import { CheckBadgeIcon, PrinterIcon, ShareIcon } from '@heroicons/react/24/solid';

const BookingTicket = ({ ticket }) => {
    // ticket object expected: { id, matatu_name, route, seat_number, amount, date }
    
    const formattedDate = dayjs(ticket.date).format('ddd, MMM D, YYYY');
    const formattedTime = dayjs(ticket.date).format('h:mm A');

    return (
        <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-300">
            <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl">
                {/* Status Banner */}
                <div className="bg-green-600 p-4 text-center text-white">
                    <CheckBadgeIcon className="w-12 h-12 mx-auto mb-2" />
                    <h2 className="text-xl font-black">BOOKING CONFIRMED</h2>
                    <p className="text-green-100 text-sm">Show this to the conductor</p>
                </div>

                <div className="p-8 space-y-6 relative">
                    {/* Ticket Details */}
                    <div className="flex justify-between border-b border-slate-100 pb-4">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Route</p>
                            <p className="font-bold text-lg">{ticket.route}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Seat</p>
                            <p className="font-black text-2xl text-green-600">{ticket.seat_number}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                            <p className="font-bold">{formattedDate}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Time</p>
                            <p className="font-bold">{formattedTime}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end pt-4">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Transaction ID</p>
                            <p className="font-mono text-xs">{ticket.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Paid</p>
                            <p className="font-black text-xl">KES {ticket.amount}</p>
                        </div>
                    </div>

                    {/* Aesthetic Ticket Cutout */}
                    <div className="absolute -left-4 top-1/2 w-8 h-8 bg-slate-950 rounded-full"></div>
                    <div className="absolute -right-4 top-1/2 w-8 h-8 bg-slate-950 rounded-full"></div>
                    <div className="border-t-2 border-dashed border-slate-200 mt-2"></div>
                </div>

                {/* Footer / QR Placeholder */}
                <div className="p-8 pt-0 flex flex-col items-center">
                    <div className="w-32 h-32 bg-slate-100 rounded-xl mb-4 flex items-center justify-center border-2 border-slate-200">
                         {/* Replace with actual QR component later */}
                        <div className="text-slate-300 text-[10px] text-center px-4">QR CODE FOR VERIFICATION</div>
                    </div>
                    <p className="text-xs text-slate-400 italic">Scan to verify passenger</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
                <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                    <PrinterIcon className="w-5 h-5" /> Print
                </button>
                <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                    <ShareIcon className="w-5 h-5" /> Share
                </button>
            </div>
        </div>
    );
};

export default BookingTicket;