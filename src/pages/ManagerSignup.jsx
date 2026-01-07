import React, { useState } from "react";
import matatuIcon from "../assets/Matatu_icon.png"; 
import "../index.css";

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
    console.log({ firstName, lastName, saccoName, email, workEmail, password, agree });
  };

  return (
    <div className="page">
      <header className="top">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={matatuIcon} alt="Matatu Connect" width="28" height="28" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Matatu Connect</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>MANAGER PORTAL</div>
          </div>
        </div>

        <div style={{ fontSize: 12 }}>
          <span style={{ opacity: 0.7 }}>Already a partner?</span>{" "}
          <a href="#" style={{ fontWeight: 600 }}>Log in →</a>
        </div>
      </header>

      <main className="wrap">
        <section className="grid">
          <section className="left">
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
              OFFICIAL PARTNER ACCESS
            </div>

            <h1 style={{ margin: "14px 0 10px" }}>
              Manage your fleet efficiently.
            </h1>

            <p style={{ margin: 0, opacity: 0.75, maxWidth: 520 }}>
              Join Nairobi’s smartest transport network. Track revenue, monitor driver
              performance, and optimize routes in real time.
            </p>

            <ul style={{ marginTop: 18, paddingLeft: 18, opacity: 0.9 }}>
              <li style={{ marginBottom: 8 }}>Real-time Analytics</li>
              <li>Direct M-Pesa Integration</li>
            </ul>

            <p style={{ marginTop: 18, opacity: 0.7, fontSize: 12 }}>
              Trusted by 500+ SACCO managers
            </p>
          </section>

          <aside className="card">
            <h2 style={{ margin: 0 }}>Create Manager Account</h2>
            <p style={{ marginTop: 6, opacity: 0.75 }}>
              Enter your details to register your fleet.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
              <div className="two">
                <Field
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
                <Field
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kamau"
                />
              </div>

              <Field
                label="Sacco name / fleet ID"
                value={saccoName}
                onChange={(e) => setSaccoName(e.target.value)}
                placeholder="e.g. Super Metro"
              />

              <Field
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />

              <Field
                label="Work email"
                type="email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="manager@example.com"
              />

              <Field
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <label style={{ display: "flex", gap: 10, fontSize: 12, opacity: 0.8 }}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  I agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.
                </span>
              </label>

              <button className="primary" type="submit" disabled={!agree}>
                Create Account
              </button>

              <div style={{ textAlign: "center", fontSize: 12, opacity: 0.7 }}>
                Or continue with
              </div>

              <button className="secondary" type="button">
                Sign up with Google
              </button>
            </form>
          </aside>
        </section>

        <footer className="foot">
          <span style={{ opacity: 0.7, fontSize: 12 }}>
            2024 Matatu Connect. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 14, fontSize: 12, opacity: 0.7 }}>
            <a href="#">Help Center</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, opacity: 0.75 }}>{label}</span>
      <input value={value} onChange={onChange} placeholder={placeholder} type={type} />
    </label>
  );
}

export default  ManagerSignup
