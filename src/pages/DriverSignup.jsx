import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import matatuIcon from "../assets/Matatu_icon.png";

export default function DriverSignup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    licence: "",
    plate: "",
    email: "",
    phone_number: "", // added field
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saccos, setSaccos] = useState([]);

  useState(() => {
    fetch("/api/saccos")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setSaccos(data.data);
      })
      .catch(err => console.error("Error fetching Saccos:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.email || !formData.password || !formData.licence || !formData.phone_number) {
      setError("Please fill in all required fields (including License, Plate, Phone)");
      return;
    }

    setLoading(true);
    try {
      // Combine names for backend
      const payload = {
        name: `${formData.firstName} ${formData.secondName}`.trim(),
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        licence: formData.licence,
        plate: formData.plate,
        role: "driver",
        sacco_id: formData.sacco_id // Link to Sacco
      };
      await signup(payload);
      navigate("/driver-dashboard");
    } catch (err) {
      setError("Failed to create account. Please try again.");
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
      <div className="mc-blob-a" />
      <div className="mc-blob-c" />

      <div className="mc-shell grid lg:grid-cols-2 gap-12 items-center max-w-5xl">

        {/* LEFT – FORM CARD */}
        <div className="mc-card mc-card-pad w-full">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <img src={matatuIcon} alt="Matatu Connect" className="w-8 h-8" />
            <span className="text-lg font-semibold tracking-tight">Matatu Connect</span>
          </div>

          <h1 className="mc-h2 mb-2">Driver Registration</h1>
          <p className="mc-muted mb-8 text-sm">
            Join our network of professional drivers and manage your trips efficiently.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mc-label">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="mc-input"
                />
              </div>
              <div>
                <label className="mc-label">Last Name</label>
                <input
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleChange}
                  placeholder="Kamau"
                  className="mc-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mc-label">Licence No.</label>
                <input
                  name="licence"
                  value={formData.licence}
                  onChange={handleChange}
                  placeholder="DL-12345"
                  className="mc-input"
                />
              </div>
              <div>
                <label className="mc-label">Number Plate</label>
                <input
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="KAA 123A"
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
                placeholder="driver@example.com"
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
                placeholder="2547XXXXXXXX"
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

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mc-btn-primary w-full mt-4"
            >
              {loading ? "Creating Account..." : "Sign Up as Driver"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 mc-muted">
            Already have an account?{" "}
            <Link to="/login" className="mc-link">
              Log in
            </Link>
          </p>
        </div>

        {/* RIGHT – INFO PANEL (Desktop only) */}
        <div className="hidden lg:block space-y-8 pl-8">
          <div className="space-y-4">
            <h2 className="mc-h1">Drive Smarter,<br />Earn Better.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Get real-time trip requests, optimize your routes, and manage your earnings directly from the dashboard.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">1</div>
              <div>
                <h3 className="font-semibold text-white">Verified Profile</h3>
                <p className="text-sm text-slate-400">Build trust with verified badges and ratings.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">2</div>
              <div>
                <h3 className="font-semibold text-white">Route Analytics</h3>
                <p className="text-sm text-slate-400">See high-demand areas and peak times.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">3</div>
              <div>
                <h3 className="font-semibold text-white">Fleet Connection</h3>
                <p className="text-sm text-slate-400">Seamlessly link with your SACCO or fleet manager.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
