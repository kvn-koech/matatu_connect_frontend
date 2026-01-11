import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import matatuIcon from "../assets/Matatu_icon.png";
import googleIcon from "../assets/google_icon.png";

export default function LoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Default role for logic, though actual role comes from backend usually
  // We can let user pick role or simple login logic
  const [role, setRole] = useState("commuter");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Backend expects 'email', not 'username'.
      // The state 'username' holds the input value which is used as email.
      const user = await login({ email: username, password, role });

      // Redirect based on role
      console.log("Logged in user role:", user.role); // Debugging log

      // VALIDATE SELECTED ROLE VS ACTUAL ROLE
      // VALIDATE SELECTED ROLE VS ACTUAL ROLE (Strict & Case-Insensitive)
      const selectedRole = role.toLowerCase().trim();
      const userRole = (user.role || "").toLowerCase().trim();

      console.log(`Role Verification: Selected='${selectedRole}', Actual='${userRole}'`);

      let isAllowed = false;

      if (selectedRole === "commuter") {
        isAllowed = (userRole === "commuter");
      } else if (selectedRole === "driver") {
        isAllowed = (userRole === "driver");
      } else if (selectedRole === "manager") {
        isAllowed = (userRole === "manager" || userRole === "sacco_manager");
      }

      if (!isAllowed) {
        const expected = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
        const actual = userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : "Unknown";

        setError(`Login Restricted: This login is for ${expected}s only. Your account is a ${actual} account.`);
        logout(); // Clear session immediately
        return;
      }

      if (user.role === "driver") {
        navigate("/driver-dashboard");
      } else if (user.role === "sacco_manager" || user.role === "manager") {
        // Handle both cases just to be safe, but backend standard is 'sacco_manager'
        navigate("/dashboard-overview");
      } else {
        navigate("/commuter-dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Invalid username or password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mc-page flex items-center justify-center p-4">
      {/* Background */}
      <div className="mc-bg" />
      <div className="mc-grid" />
      <div className="mc-blob-a" />
      <div className="mc-blob-c" />

      <div className="mc-shell flex items-center justify-center min-h-screen py-10">
        <div className="mc-card mc-card-pad w-full max-w-[420px]">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <img src={matatuIcon} alt="Matatu Connect" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Matatu Connect</h1>
              <p className="mc-muted text-xs tracking-wider uppercase">Welcome back</p>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="mc-h2 mb-2">Log in to your account</h2>
            <p className="mc-muted text-sm">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Role switcher (Optional visual cue) */}
          <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6">
            {[
              { id: "commuter", label: "Commuter" },
              { id: "driver", label: "Driver" },
              { id: "manager", label: "Manager" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${role === r.id
                  ? "bg-emerald-500 text-slate-900 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mc-label">Email or Username</label>
              <div className="relative">
                <input
                  type="text"
                  name="loginIdentifier"
                  id="loginIdentifier"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mc-input pr-10"
                  placeholder="name@example.com"
                />
                {username && (
                  <button
                    type="button"
                    onClick={() => setUsername("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                    title="Clear"
                  >
                    {/* X Icon SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="mc-label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mc-input pr-10"
                  placeholder="••••••••"
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setPassword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                    title="Clear"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mc-btn-primary w-full shadow-lg shadow-emerald-900/20"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Or continue with</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Google login */}
          <button className="mc-btn-secondary w-full text-sm">
            <img src={googleIcon} alt="Google" className="w-4 h-4" />
            <span>Google</span>
          </button>

          {/* Signup */}
          <p className="text-sm text-center mt-8 text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/commuter-signup"
              className="text-emerald-400 font-medium hover:underline ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
