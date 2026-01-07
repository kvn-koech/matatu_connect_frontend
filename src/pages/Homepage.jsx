import matatuIcon from "../assets/Matatu_icon.png";

export default function LandingPage() {
  return (
    <main className="bg-background text-text-main">
      <Hero />
      <Features />
      <CtaSection />
      <Footer />
    </main>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section
      id="home"
      className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center"
    >
      <div>
        <p className="text-secondary font-semibold mb-4 uppercase tracking-wide">
          Live tracking
        </p>

        <h1 className="text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Track & Book <br /> Matatus in Real-Time
        </h1>

        <p className="text-text-muted text-lg mb-10">
          Navigate the city with confidence. Cashless payments, live route
          updates, and safer rides right from your pocket.
        </p>

        <div className="flex items-center gap-8">
          <button className="btn-primary shadow-md hover:shadow-lg">
            Get Started
          </button>

          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span>Easy onboarding</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-3xl h-80 flex flex-col items-center justify-center text-text-muted border">
        <span className="text-sm uppercase tracking-wide mb-2">
          Live Map Preview
        </span>
        <span className="text-xs">
          Real-time matatu tracking
        </span>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */

function Features() {
  return (
    <section id="features" className="bg-surface py-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">
          Why Choose Matatu Connect?
        </h2>

        <p className="text-text-muted mb-16 max-w-2xl text-lg">
          Experience the future of public transport in Kenya with features
          designed for safety and convenience.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            title="Live Tracking"
            text="Track matatus in real time across the city."
          />
          <FeatureCard
            title="M-Pesa Integrated"
            text="Cashless, secure, instant payments."
          />
          <FeatureCard
            title="Safe Rides"
            text="Verified drivers, routes, and trip details."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="card">
      <div className="w-12 h-12 bg-secondary-light rounded-xl mb-6" />
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-text-muted">{text}</p>
    </div>
  );
}

/* ---------------- CTA ---------------- */

function CtaSection() {
  return (
    <section className="bg-secondary text-white py-28 text-center">
      <h2 className="text-4xl font-bold mb-4">
        Ready to upgrade your commute?
      </h2>

      <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">
        Smarter, safer, cashless matatu rides.
      </p>

      <button className="bg-white text-secondary px-10 py-4 rounded-lg font-medium hover:bg-blue-50 shadow">
        Get started
      </button>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer id="support" className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-6 text-sm text-text-muted">
        <div className="flex items-center gap-2 font-semibold text-text-main">
          <img src={matatuIcon} alt="Matatu Connect" className="w-5 h-5" />
          Matatu Connect
        </div>

        <div className="flex gap-6 flex-wrap">
          <a href="#about" className="hover:text-text-main">About</a>
          <a href="#home" className="hover:text-text-main">Home</a>
          <a href="#privacy" className="hover:text-text-main">Privacy</a>
          <a href="#terms" className="hover:text-text-main">Terms</a>
          <a href="#contact" className="hover:text-text-main">Contact</a>
        </div>
      </div>

      <div className="text-center text-xs text-text-muted pb-6">
        © 2025 Matatu Connect. All rights reserved.
      </div>
    </footer>
  );
}
