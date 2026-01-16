import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import matatuIcon from "../assets/Matatu_icon.png";

export default function ManagerSignup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    saccoName: "", // Keeping for compat, but using sacco_id
    email: "",
    workEmail: "",
    phone_number: "", // added field
    password: "",
    agree: false
  });

  const [saccos, setSaccos] = useState([]);

  useState(() => {
    fetch("/api/saccos")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setSaccos(data.data);
      })
      .catch(err => console.error("Error fetching Saccos:", err));
  }, []);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.email || !formData.password || !formData.agree || !formData.phone_number) {
      setError("Please fill in all fields (including Phone) and agree to terms");
      return;
    }

    setLoading(true);
    try {
      // Backend expects 'name', 'email', 'password', 'role'
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role: "sacco_manager",
        sacco_id: isNewSacco ? null : formData.sacco_id,
        sacco_name: isNewSacco ? formData.saccoName : null
      };
      await signup(payload);
      navigate("/dashboard-overview");
    } catch (err) {
      console.error("Signup Error", err);
      // Extract specific error message
      const msg = err.response?.data?.error || err.message || "Failed to create account.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
  };

  const [isNewSacco, setIsNewSacco] = useState(false);
  const handleSaccoChange = (e) => {
    const val = e.target.value;
    if (val === "new") {
      setIsNewSacco(true);
      setFormData(prev => ({ ...prev, sacco_id: "" }));
    } else {
      setIsNewSacco(false);
      setFormData(prev => ({ ...prev, sacco_id: val, saccoName: "" }));
    }
  };

  return (
    <div className="mc-page text-slate-100 flex flex-col">
      <div className="mc-bg" />

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={matatuIcon} alt="Matatu Connect" className="w-8 h-8" />
            <div>
              <p className="font-bold leading-none tracking-tight">Matatu Connect</p>
              <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Manager Portal</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 hidden sm:block">
            Already a partner?{" "}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline bg-emerald-500/10 px-3 py-1.5 rounded-full ml-1 transition-colors hover:bg-emerald-500/20">
              Log in →
            </Link>
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-16 items-start">
        {/* LEFT INFO */}
        <section className="pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official Partner Access
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-[1.1]">
            Manage your fleet <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">efficiently.</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-lg mb-10 leading-relaxed">
            Join Nairobi’s smartest transport network. Track revenue, monitor
            driver performance, and optimize routes in real time.
          </p>

          <ul className="space-y-4 text-slate-300">
            {[
              "Real-time analytics & reporting",
              "Direct M-Pesa integration",
              "Fleet & driver monitoring",
              "Automated compliance checks"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] text-slate-500">U{idx}</div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              Trusted by <strong className="text-white">500+</strong> SACCO managers
            </p>
          </div>
        </section>

        {/* FORM CARD */}
        <aside className="mc-card p-8 w-full">
          <h2 className="mc-h2 mb-2">
            Create Manager Account
          </h2>
          <p className="mc-muted mb-6 text-sm">
            Enter your details to register your fleet.
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
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Wick"
                  className="mc-input"
                />
              </div>
            </div>

            <div>
              <label className="mc-label">Select Your Sacco</label>
              <select
                name="sacco_id"
                value={isNewSacco ? "new" : (formData.sacco_id || "")}
                onChange={handleSaccoChange}
                className="mc-input appearance-none bg-black/20"
              >
                <option value="">-- Choose Sacco --</option>
                {saccos.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
                <option value="new" className="text-emerald-400 font-bold">+ Register New Sacco</option>
              </select>
            </div>

            {isNewSacco && (
              <div>
                <label className="mc-label">New Sacco Name</label>
                <input
                  name="saccoName"
                  value={formData.saccoName}
                  onChange={handleChange}
                  placeholder="Enter Sacco Name"
                  className="mc-input border-emerald-500/50 bg-emerald-500/10"
                />
              </div>
            )}

            <div>
              <label className="mc-label">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@supermetro.co.ke"
                className="mc-input"
              />
            </div>

            <div>
              <label className="mc-label">Work Email (Optional)</label>
              <input
                name="workEmail"
                type="email"
                value={formData.workEmail}
                onChange={handleChange}
                placeholder="admin@supermetro.co.ke"
                className="mc-input"
              />
            </div>

            <div>
              <label className="mc-label">Phone Number</label>
              <input
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="2547XXXXXXXX"
                className="mc-input"
              />
            </div>

            <div>
              <label className="mc-label">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mc-input"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-400 mt-2 select-none cursor-pointer group">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50"
              />
              <span className="group-hover:text-slate-300 transition-colors">
                I agree to the{" "}
                <a href="#" className="text-emerald-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-400 hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!formData.agree || loading}
              className="mc-btn-primary w-full mt-2"
            >
              {loading ? "Creating Account..." : "Create Manager Account"}
            </button>
          </form>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <span>© 2024 Matatu Connect. All rights reserved.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300 transition-colors">Help Center</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
