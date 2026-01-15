import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import matatuIcon from "../assets/Matatu_icon.png";

export default function CommuterSignup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    secondname: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstname || !formData.email || !formData.password || !formData.phone_number) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Combine names for backend
      const payload = {
        name: `${formData.firstname} ${formData.secondname}`.trim(),
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role: "commuter"
      };
      await signup(payload);
      navigate("/commuter-dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      // Extract specific error message from backend response if available
      const errorMessage = err.response?.data?.error || "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mc-page flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="mc-bg" />
      <div className="mc-grid" />
      <div className="mc-blob-b" />

      <div className="mc-shell grid lg:grid-cols-2 gap-16 items-center max-w-5xl">

        {/* LEFT – INFO PANEL (Desktop only) */}
        <div className="hidden lg:block space-y-8 pr-8">
          <div className="space-y-4">
            <h2 className="mc-h1">The Smart Way<br />to Move.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Join thousands of commuters who save time and travel safely with Matatu Connect.
            </p>
          </div>

          <div className="space-y-6">
            <blockquote className="mc-glass p-6 text-sm italic text-slate-300 border-l-4 border-emerald-500">
              "Since using Matatu Connect, I never worry about finding a ride during rush hour. It's a game changer!"
              <footer className="mt-3 font-semibold not-italic text-white">– Jane W., Daily Commuter</footer>
            </blockquote>
          </div>
        </div>

        {/* RIGHT – FORM CARD */}
        <div className="mc-card mc-card-pad w-full">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <img src={matatuIcon} alt="Matatu Connect" className="w-8 h-8" />
            <span className="text-lg font-semibold tracking-tight">Matatu Connect</span>
          </div>

          <h1 className="mc-h2 mb-2">Create Account</h1>
          <p className="mc-muted mb-8 text-sm">
            Sign up to track rides, pay securely, and rate your trips.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mc-label">First Name</label>
                <input
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="mc-input"
                />
              </div>
              <div>
                <label className="mc-label">Last Name</label>
                <input
                  name="secondname"
                  value={formData.secondname}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="mc-input"
                />
              </div>
            </div>

            <div>
              <label className="mc-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="mc-input"
              />
            </div>

            <div>
              <label className="mc-label">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="0712345678"
                className="mc-input"
              />
            </div>

            <div>
              <label className="mc-label">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="0712345678"
                className="mc-input"
              />
            </div>

            <div>
              <label className="mc-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mc-input"
              />
            </div>



            {/* Social mock buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button type="button" className="mc-btn-secondary text-xs py-2.5">
                Google
              </button>
              <button type="button" className="mc-btn-secondary text-xs py-2.5">
                Apple
              </button>
            </div>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mc-btn-primary w-full mt-6"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 mc-muted">
            Already have an account?{" "}
            <Link to="/login" className="mc-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
