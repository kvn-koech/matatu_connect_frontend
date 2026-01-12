import { useState, useEffect } from "react";
import { fetchMatatuBookings } from "../../api/bookings";
import { Armchair } from "lucide-react";

const SeatSelector = ({ totalSeats = 14, matatuId, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]); // confirmed bookings
  const [pendingSeats, setPendingSeats] = useState([]); // pending bookings
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (matatuId) {
      loadSeatStatus();
    }
  }, [matatuId]);

  const loadSeatStatus = async () => {
    try {
      setLoading(true);
      const res = await fetchMatatuBookings(matatuId);
      const bookings = res.data?.data || res.data || [];

      // Separate confirmed and pending bookings
      const confirmed = bookings
        .filter(b => b.status === 'confirmed')
        .map(b => b.seat_number);
      const pending = bookings
        .filter(b => b.status === 'pending')
        .map(b => b.seat_number);

      setOccupiedSeats(confirmed);
      setPendingSeats(pending);
    } catch (err) {
      console.error("Failed to load seat status:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    // Can't select occupied or pending seats
    if (occupiedSeats.includes(seat) || pendingSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const getSeatStyle = (seat) => {
    const isOccupied = occupiedSeats.includes(seat);
    const isPending = pendingSeats.includes(seat);
    const isSelected = selectedSeats.includes(seat);

    if (isOccupied) {
      return "bg-red-500/20 text-red-400 border-red-500/30 cursor-not-allowed";
    }
    if (isPending) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 cursor-not-allowed";
    }
    if (isSelected) {
      return "bg-primary text-black border-primary";
    }
    return "bg-surface-dark text-white hover:bg-primary/30 border-white/10";
  };

  if (loading) {
    return (
      <div className="mc-card mc-card-pad space-y-6">
        <p className="text-text-muted text-center">Loading seat availability...</p>
      </div>
    );
  }

  return (
    <div className="mc-card mc-card-pad space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Armchair size={20} className="text-primary" />
          Select Your Seat
        </h3>
        <p className="text-sm text-text-muted">
          {occupiedSeats.length + pendingSeats.length}/{totalSeats} Booked
        </p>
      </div>

      {/* LEGEND */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-surface-dark border border-white/10"></div>
          <span className="text-text-muted">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
          <span className="text-text-muted">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
          <span className="text-text-muted">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary border border-primary"></div>
          <span className="text-text-muted">Selected</span>
        </div>
      </div>

      {/* SEAT GRID */}
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: totalSeats }, (_, i) => {
          const seat = i + 1;
          const isDisabled = occupiedSeats.includes(seat) || pendingSeats.includes(seat);

          return (
            <button
              key={seat}
              onClick={() => toggleSeat(seat)}
              disabled={isDisabled}
              className={`
                h-12 rounded-lg font-semibold text-sm transition border-2
                ${getSeatStyle(seat)}
              `}
            >
              {seat}
            </button>
          );
        })}
      </div>

      {/* ACTION */}
      <button
        disabled={!selectedSeats.length}
        onClick={() => onConfirm(selectedSeats)}
        className={`mc-btn-primary w-full shadow-lg ${!selectedSeats.length ? "opacity-50 grayscale cursor-not-allowed" : "hover:scale-[1.02]"
          }`}
      >
        <span className="font-bold">Confirm Selection</span>
        {selectedSeats.length > 0 && (
          <span className="bg-black/20 px-2 py-0.5 rounded text-xs">
            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}
          </span>
        )}
      </button>
    </div>
  );
};

export default SeatSelector;
