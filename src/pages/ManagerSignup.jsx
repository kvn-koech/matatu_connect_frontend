import React, { useState } from "react";
import { Link } from "react-router-dom";
import matatuIcon from "../assets/Matatu_icon.png";

function ManagerSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saccoName, setSaccoName] = useState("");
  const [email, setEmail] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      saccoName,
      email,
      workEmail,
      password,
      agree,
    });
  };

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={matatuIcon} alt="Matatu Connect" className="w-7 h-7" />
            <div>
              <p className="font-semibold leading-none">Matatu Connect</p>
              <p className="text-xs text-text-muted">MANAGER PORTAL</p>
            </div>
          </div>

          <p className="text-sm text-text-muted">
            Already a partner?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Log in →
            </Link>
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-start">
        {/* LEFT INFO */}
        <section>
          <p className="text-sm font-semibold text-primary mb-4">
            OFFICIAL PARTNER ACCESS
          </p>

          <h1 className="text-4xl font-bold mb-4">
            Manage your fleet efficiently.
          </h1>

          <p className="text-text-muted max-w-lg mb-8">
            Join Nairobi’s smartest transport network. Track revenue, monitor
            driver performance, and optimize routes in real time.
          </p>

          <ul className="space-y-3 text-text-muted">
            <li>✔ Real-time analytics & reporting</li>
            <li>✔ Direct M-Pesa integration</li>
            <li>✔ Fleet & driver monitoring</li>
          </ul>

          <p className="mt-8 text-sm text-text-muted">
            Trusted by 500+ SACCO managers
          </p>
        </section>

        {/* FORM CARD */}
        <aside className="card max-w-xl w-full">
          <h2 className="text-2xl font-semibold mb-1">
            Create Manager Account
          </h2>
          <p className="text-text-muted mb-6">
            Enter your details to register your fleet.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                value={firstName}
                onChange={setFirstName}
                placeholder="John"
              />
              <Input
                label="Last name"
                value={lastName}
                onChange={setLastName}
                placeholder="Kamau"
              />
            </div>

            <Input
              label="SACCO name / Fleet ID"
              value={saccoName}
              onChange={setSaccoName}
              placeholder="Super Metro"
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="email@example.com"
            />

            <Input
              label="Work email"
              type="email"
              value={workEmail}
              onChange={setWorkEmail}
              placeholder="manager@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-primary"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-primary">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary">
                  Privacy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={!agree}
              className="btn-primary w-full disabled:opacity-50"
            >
              Create Account
            </button>

            <div className="text-center text-sm text-text-muted">
              Or continue with
            </div>

            <button type="button" className="btn-secondary w-full">
              Sign up with Google
            </button>
          </form>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between text-sm text-text-muted">
          <span>© 2024 Matatu Connect</span>
          <div className="flex gap-6">
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-text-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

export default ManagerSignup;
