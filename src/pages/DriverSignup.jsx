import { useState } from "react";
import matatuIcon from "../assets/Matatu_icon.png";

export default function DriverSignup() {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [licence, setLicence] = useState("");
  const [plate, setPlate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      secondName,
      licence,
      plate,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT – FORM */}
      <div className="flex items-center justify-center px-6 bg-background">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <img src={matatuIcon} alt="Matatu Connect" className="w-8 h-8" />
            <span className="font-bold text-lg text-secondary">
              Matatu Connect
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold mb-2">
            Create your driver account
          </h1>
          <p className="text-text-muted mb-6">
            Register as a driver and start operating smarter.
          </p>

          {/* Social buttons (UI only) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="border rounded-lg py-2 hover:bg-surface transition">
              Continue with Google
            </button>
            <button className="border rounded-lg py-2 hover:bg-surface transition">
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-text-muted">
              Or register with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
              <input
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
                placeholder="Second name"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                value={licence}
                onChange={(e) => setLicence(e.target.value)}
                placeholder="Driver licence number"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Vehicle number plate"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            />

            <button type="submit" className="btn-primary w-full mt-4">
              Sign up as Driver
            </button>
          </form>

          <p className="text-sm text-text-muted text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-secondary hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT – INFO PANEL */}
      <div className="hidden md:flex items-center justify-center bg-surface px-10">
        <div className="max-w-md text-center">
          <div className="bg-white rounded-2xl h-48 mb-6 flex items-center justify-center text-text-muted shadow-sm">
            Icon / Illustration
          </div>

          <h2 className="text-xl font-semibold mb-2">
            Live Tracking & Real-time Updates
          </h2>
          <p className="text-text-muted">
            Never miss your ride again. Track your matatu in real-time and plan
            your journey with confidence.
          </p>

          <div className="flex justify-center gap-2 mt-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="w-2 h-2 bg-gray-300 rounded-full" />
            <span className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
