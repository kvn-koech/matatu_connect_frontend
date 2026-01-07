import { Link } from "react-router-dom";

const Navbar = ({ role }) => {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-secondary"
        >
          🚍 Matatu Connect
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm text-text-muted">
          <Link to="/" className="hover:text-text-main">
            Home
          </Link>

          {!role && (
            <>
              <Link to="/login" className="hover:text-text-main">
                Login
              </Link>
              <Link to="/commuter-signup" className="hover:text-text-main">
                Commuter Signup
              </Link>
              <Link to="/driver-signup" className="hover:text-text-main">
                Driver Signup
              </Link>
            </>
          )}

          {role === "commuter" && (
            <Link
              to="/commuter-dashboard"
              className="font-medium text-secondary hover:underline"
            >
              Dashboard
            </Link>
          )}

          {role === "driver" && (
            <Link
              to="/driver-dashboard"
              className="font-medium text-secondary hover:underline"
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
