import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-emerald-400"
        >
          🚍 Matatu Connect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-slate-300 hover:text-white transition">
            Home
          </Link>

          <Link
            to="/login"
            className="text-slate-300 hover:text-white transition"
          >
            Login
          </Link>

          {/* GET STARTED DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="mc-btn mc-btn-primary mc-btn-sm"
            >
              Get Started
            </button>

            {open && (
              <div
                className="absolute right-0 mt-3 w-52 rounded-2xl
                bg-slate-900 ring-1 ring-white/10 shadow-xl overflow-hidden z-50"
              >
                <Link
                  to="/commuter-signup"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                >
                  🚶 Commuter Signup
                </Link>

                <Link
                  to="/driver-signup"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                >
                  🚗 Driver Signup
                </Link>

                <Link
                  to="/manager-signup"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                >
                  🏢 Sacco Manager Signup
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
