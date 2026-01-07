import { useState } from "react";
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
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <img src={matatuIcon} alt="Matatu Connect" className="w-8 h-8" />
          <span className="font-bold text-lg text-secondary">
            Matatu Connect
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2">
          Welcome back
        </h1>
        <p className="text-text-muted mb-6">
          Please log in to continue
        </p>

        {/* Role switcher */}
        <div className="flex gap-2 mb-6">
          {["commuter", "driver", "sacco_manager"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                role === r
                  ? "bg-secondary text-white border-secondary"
                  : "border-gray-300 text-text-muted hover:bg-surface"
              }`}
            >
              {r.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
          />

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Login
          </button>
        </form>

        <div className="flex justify-end mt-3">
          <a href="#" className="text-sm text-secondary hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-text-muted">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google login */}
        <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-surface transition">
          <img src={googleIcon} alt="Google" className="w-4 h-4" />
          Sign in with Google
        </button>

        {/* Signup */}
        <p className="text-sm text-text-muted text-center mt-6">
          Don’t have an account?{" "}
          <a href="/commuter-signup" className="text-secondary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
