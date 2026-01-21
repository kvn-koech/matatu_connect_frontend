import matatuIcon from "../assets/Matatu_icon.png";
import { useState, useEffect } from "react";
import { fetchMatatus } from "../api/matatus";
import LiveMap from "../components/map/LiveMap";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, MapPin, Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="bg-[#0b0f0e] text-gray-200">
      <Hero />
      <Features />
      <CtaSection />
      <Footer />
    </main>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  const navigate = useNavigate();
  const [heroVehicles, setHeroVehicles] = useState([]);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await fetchMatatus();
        const vehicleList = res.data?.data || res.data || [];

        // Generate Mock Coordinates for real vehicles
        const mapped = vehicleList.map(v => ({
          id: v.id,
          name: v.plate_number,
          lat: -1.2921 + (Math.random() - 0.5) * 0.05,
          lng: 36.8219 + (Math.random() - 0.5) * 0.05,
          status: "Moving" // Mock status for visual
        }));

        // If no vehicles, keep some mock ones for display
        if (mapped.length > 0) {
          setHeroVehicles(mapped);
        } else {
          setHeroVehicles([
            { id: 1, lat: -1.2921, lng: 36.8219, name: "KBZ 123A", status: "Moving" },
            { id: 2, lat: -1.2841, lng: 36.8155, name: "KCA 456B", status: "Stopped" },
            { id: 3, lat: -1.3000, lng: 36.7800, name: "KDB 789C", status: "Moving" },
          ]);
        }
      } catch (err) {
        console.error("Failed to load map data", err);
      }
    };
    loadVehicles();
  }, []);

  return (
    <section
      id="home"
      className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center relative z-10"
    >
      <div>
        <p className="text-emerald-400 font-bold mb-6 uppercase tracking-widest text-xs flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live tracking active
        </p>

        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-8 text-white animate-slideUp">
          Track & Book <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Matatus in Real-Time
          </span>
        </h1>

        <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg animate-slideUp" style={{ animationDelay: "100ms" }}>
          Navigate Nairobi with confidence. Cashless payments, live route
          updates, and safer rides right from your pocket. Join thousands of daily commuters.
        </p>

        <div className="flex items-center gap-6 animate-slideUp" style={{ animationDelay: "200ms" }}>
          <button
            onClick={() => navigate('/login')}
            className="mc-btn-primary px-8 py-4 text-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            Get Started
          </button>

          <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-background ring-2 ring-emerald-500/10" />
              <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-background ring-2 ring-emerald-500/10" />
              <div className="w-10 h-10 rounded-full bg-slate-500 border-2 border-background ring-2 ring-emerald-500/10" />
            </div>
            <span className="ml-1">10k+ Commuters</span>
          </div>
        </div>
      </div>

      <div className="relative h-[600px] w-full bg-slate-900/60 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl shadow-emerald-900/20 group animate-fadeIn" style={{ animationDelay: "300ms" }}>
        <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700 filter saturate-150">
          <LiveMap vehicles={heroVehicles} centerVehicle={heroVehicles[0]} />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Floating badge */}
        <div className="absolute bottom-8 left-8 z-10 bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-4 rounded-3xl flex items-center gap-4 shadow-xl hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-glow">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live System</p>
            <p className="text-white font-bold text-lg">{heroVehicles.length > 0 ? `${heroVehicles.length} Active Matatus` : "Loading Fleet..."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */

function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-emerald-400 font-bold tracking-widest uppercase text-xs mb-3 block">Why Choose Matatu Connect?</span>
          <h2 className="text-5xl font-bold mb-6 text-white tracking-tight">
            The Smart Way to Commute
          </h2>
          <p className="text-slate-400 text-lg">
            Experience the future of public transport in Kenya with features
            designed for safety, transparency, and convenience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MapPin size={32} className="text-emerald-400" />}
            title="Live Tracking"
            desc="See exactly where your ride is. No more guessing when the next matatu will arrive."
            color="emerald"
          />
          <FeatureCard
            icon={<Wallet size={32} className="text-blue-400" />}
            title="M-Pesa Integrated"
            desc="Pay securely directly from your phone. Cashless, receipted, and hassle-free."
            color="blue"
          />
          <FeatureCard
            icon={<ShieldCheck size={32} className="text-purple-400" />}
            title="Safe Rides"
            desc="Verified drivers and real-time monitoring ensure you reach your destination safely."
            color="purple"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const colorClasses = {
    emerald: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    blue: "bg-blue-500/10 group-hover:bg-blue-500/20",
    purple: "bg-purple-500/10 group-hover:bg-purple-500/20",
  };

  return (
    <div className="mc-card p-8 group hover:-translate-y-2 transition-transform duration-300 border-transparent hover:border-white/10">
      <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-colors ${colorClasses[color] || "bg-white/5"}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}

/* ---------------- CTA ---------------- */

function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 relative px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Ready to upgrade your commute?
          </h2>

          <p className="opacity-90 mb-10 text-xl font-medium max-w-2xl mx-auto text-emerald-50">
            Join the thousands of Kenyans moving smarter, safer, and cashless today.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="bg-white text-emerald-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
          >
            Get started now
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0f0e]">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2 font-semibold text-white">
          <img src={matatuIcon} alt="Matatu Connect" className="w-5 h-5" />
          Matatu Connect
        </div>

        <div className="flex gap-6 flex-wrap">
          <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-emerald-400 transition-colors">Terms</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pb-6">
        © 2025 Matatu Connect. All rights reserved.
      </div>
    </footer>
  );
}
