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
    <div className="mc-page flex items-center justify-center p-6">
      <div className="mc-bg" />
      <div className="mc-grid" />
      <div className="mc-blob-a" />
      <div className="mc-blob-b" />
      <div className="mc-blob-c" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mc-card mc-card-pad shadow-2xl animate-fadeIn">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 shadow-glass ring-1 ring-white/10">
              <img src={matatuIcon} alt="Matatu Connect" className="w-10 h-10 object-contain drop-shadow-md" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Matatu Connect</h1>
            <p className="mc-muted text-sm tracking-wide">Welcome back</p>
          </div>

          {/* Role switcher */}
          <div className="flex bg-slate-900/60 p-1.5 rounded-xl mb-8 ring-1 ring-white/5">
            {[
              { id: "commuter", label: "Commuter" },
              { id: "driver", label: "Driver" },
              { id: "manager", label: "Manager" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all duration-200 ${role === r.id
                  ? "bg-white/10 text-white shadow-md ring-1 ring-white/10"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mc-label">Email or Username</label>
              <div className="relative group">
                <input
                  type="text"
                  name="loginIdentifier"
                  id="loginIdentifier"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mc-input pr-10 focus:ring-emerald-500/30 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="mc-label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mc-input pr-10 focus:ring-emerald-500/30 transition-all font-mono tracking-widest text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mc-btn-primary w-full py-3.5 text-sm uppercase tracking-wide shadow-emerald-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] uppercase font-bold text-slate-600">Or continue with</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Google login */}
          <button className="mc-btn-secondary w-full text-xs py-3 hover:bg-white/10 transition-colors">
            <img src={googleIcon} alt="Google" className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>

          {/* Signup */}
          <p className="text-sm text-center mt-8 text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/commuter-signup"
              className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-all ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          &copy; 2026 Matatu Connect. Secure Access.
        </p>
      </div>
    </div>
  );
}
