import React from "react";
import "../index.css";
import matatuIcon from "../assets/Matatu_icon.png";
import live_trackingicon from "../assets/live_trackingicon.png";

function LandingPage() {
  return (
    <main className="page">
      <Header />

      <Hero />

      <Features />

      <CtaSection />

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <img src={matatuIcon} alt="Matatu Connect" width="22" height="22" />
        <span>Matatu Connect</span>
      </div>

      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#routes">Routes</a>
        <a href="#support">Support</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="heroLeft">
        <p className="tag">Live tracking</p>

        <h1 className="heroTitle">
          Track & Book <br />
          Matatus in Real-Time
        </h1>

        <p className="heroText">
          Navigate the city with confidence. Cashless payments, live route
          updates, and safer rides right from your pocket.
        </p>

        <div className="heroActions">
          <button type="button">Get Started</button>
          <div className="tinyRow">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span className="tinyText">Easy onboarding</span>
          </div>
        </div>
      </div>

      <div className="heroRight">
        <div className="phoneMock">Preview</div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section" id="features">
      <h2>Why Choose Matatu Connect?</h2>
      <p className="sectionText">
        Experience the future of public transport in Kenya with our cutting-edge
        features designed for safety and convenience.
      </p>

      <div className="cards">
        <FeatureCard
          title="Live Tracking"
          text="See nearby matatus in real-time and track your ride across the city."
        />
        <FeatureCard
          title="M-Pesa Integrated"
          text="Pay instantly with M-Pesa. Cashless, secure, and easy booking."
        />
        <FeatureCard
          title="Safe Rides"
          text="Verified drivers, route info, and ride details to help you travel with confidence."
        />
      </div>
    </section>
  );
}

function FeatureCard({ title, text }) {
  return (
    <article className="card">
      <div className="iconBox"></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function CtaSection() {
  return (
    <section className="cta">
      <h2>Ready to upgrade your commute?</h2>
      <p className="sectionText">
        Join thousands of commuters in Nairobi enjoying a smoother, safer, and
        smarter ride today.
      </p>
      <button type="button">Get started</button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="support">
      <div className="footerTop">
        <div className="brand">
          <img src={matatuIcon} alt="Matatu Connect" width="18" height="18" />
          <span>Matatu Connect</span>
        </div>

        <div className="footerLinks">
          <a href="#about">About</a>
          <a href="#routes">Home</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <p className="copyright">
        2025 Matatu Connect. All rights reserved.
      </p>
    </footer>
  );
}
export default LandingPage;