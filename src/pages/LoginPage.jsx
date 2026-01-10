import { useState } from "react";
import { Link } from "react-router-dom";
import matatuIcon from "../assets/Matatu_icon.png";
import googleIcon from "../assets/google_icon.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("commuter");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    setError("");
    console.log({ username, password, role });
  };

  return (
    <div className="mc-page">
      {/* Background */}
      <div className="mc-bg" />
      <div className="mc-grid" />
      <div className="mc-blob-a" />
      <div className="mc-blob-c" />

      <div className="mc-shell flex items-center justify-center min-h-screen">
        <div className="mc-card mc-card-pad w-full max-w-md">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <img src={matatuIcon} alt="Matatu Connect" className="w-9 h-9" />
            <div>
              <h1 className="text-lg font-semibold">Matatu Connect</h1>
              <p className="mc-muted text-sm">Welcome back</p>
            </div>
          </div>

          {/* Heading */}
          <h2 className="mc-h1 mb-2">Log in</h2>
          <p className="mc-muted mb-6">
            Please log in to continue
          </p>

          {/* Role switcher */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "commuter", label: "Commuter" },
              { id: "driver", label: "Driver" },
              { id: "sacco_manager", label: "Sacco Manager" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`mc-btn mc-btn-sm flex-1 ${
                  role === r.id
                    ? "mc-btn-primary"
                    : "mc-btn-ghost"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mc-label">Email or Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mc-input"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="mc-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mc-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="mc-btn-primary w-full">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google login */}
          <button className="mc-btn-secondary w-full">
            <img src={googleIcon} alt="Google" className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>

          {/* Signup */}
          <p className="text-sm text-center mt-6 mc-muted">
            Don’t have an account?{" "}
            <Link
              to="/commuter-signup"
              className="text-emerald-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
