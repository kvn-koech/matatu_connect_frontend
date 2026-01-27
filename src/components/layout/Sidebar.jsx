import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  LayoutDashboard,
  Users,
  Bus,
  Route,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ role }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition
     ${pathname === path
      ? "bg-primary/20 text-primary"
      : "text-text-muted hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="hidden md:flex w-64 flex-col bg-surface-dark border-r border-white/10">
      {/* BRAND */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-lg font-bold text-white">Matatu Connect</h1>
        <p className="text-xs text-text-muted uppercase">{role} portal</p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <Link to="/" className={linkClass("/")}>
          <Home size={18} /> Home
        </Link>

        {role === "driver" && (
          <Link to="/driver-dashboard" className={linkClass("/driver-dashboard")}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        )}

        {role === "commuter" && (
          <Link to="/commuter-dashboard" className={linkClass("/commuter-dashboard")}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        )}

        {role === "manager" && (
          <>
            <Link to="/dashboard-overview" className={linkClass("/dashboard-overview")}>
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link to="/manager/fleet" className={linkClass("/manager/fleet")}>
              <Bus size={18} /> Fleet
            </Link>
            <Link to="/manager/drivers" className={linkClass("/manager/drivers")}>
              <Users size={18} /> Drivers
            </Link>
            <Link to="/manager/routes" className={linkClass("/manager/routes")}>
              <Route size={18} /> Routes
            </Link>
            <Link to="/manager/reviews" className={linkClass("/manager/reviews")}>
              <Users size={18} /> Customer Reviews
            </Link>
          </>
        )}
      </nav>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <Link to="/settings" className={linkClass("/settings")}>
          <Settings size={18} /> Settings
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-black font-semibold">
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
