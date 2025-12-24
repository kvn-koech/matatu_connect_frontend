import React, { useState } from "react";
import matatuIcon from "../assets/Matatu_icon.png";
import "../index.css";

function CommuterSignup() {
  const [firstname, setfirstname] = useState("");
  const [secondname, setsecondname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  return (
    <Commuter
      firstname={firstname}
      setfirstname={setfirstname}
      secondname={secondname}
      setsecondname={setsecondname}
      email={email}
      setemail={setemail}
      password={password}
      setpassword={setpassword}
    />
  );
}

export default CommuterSignup;

function Commuter({
  firstname,
  setfirstname,
  secondname,
  setsecondname,
  email,
  setemail,
  password,
  setpassword,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ firstname, secondname, email, password });
  };

  return (
    <main className="signupPage">
      <section className="signupLayout">
        {/* LEFT */}
        <section className="leftPanel">
          <MatatuConnect text="Matatu Connect" icon={matatuIcon} />

          <section className="card">
            <CreateAccount
              title="Create your Account"
              subtitle="Ride smarter across Kenya. Join the community today."
            />

            <div className="socialRow">
              <GoogleButton text="Continue with Google" />
              <AppleButton text="Continue with Apple" />
            </div>

            <RegisterwithMail text="Or register with email" />

            <Signupform
              firstname={firstname}
              setfirstname={setfirstname}
              secondname={secondname}
              setsecondname={setsecondname}
              email={email}
              setemail={setemail}
              password={password}
              setpassword={setpassword}
              onSubmit={handleSubmit}
            />

            <Signupbutton text="Sign up" />
          </section>
        </section>

        {/* RIGHT */}
        <aside className="rightPanel">
          <Rightpanelimage />
          <Rightpanel
            title="Live Tracking & Real-time Updates"
            body="Never miss your ride again. Track your matatu in real-time and plan your journey with confidence."
          />
          <Rightpaneldash activeIndex={0} total={3} />
        </aside>
      </section>
    </main>
  );
}

function MatatuConnect({ text, icon }) {
  return (
    <div className="matatuConnect">
      <img className="brandIcon" src={icon} alt="Matatu icon" />
      <span className="brandText">{text}</span>
    </div>
  );
}

function CreateAccount({ title, subtitle }) {
  return (
    <div className="createAccount">
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </div>
  );
}

function GoogleButton({ text }) {
  return (
    <button type="button" className="socialBtn">
      {text}
    </button>
  );
}

function AppleButton({ text }) {
  return (
    <button type="button" className="socialBtn">
      {text}
    </button>
  );
}

function RegisterwithMail({ text }) {
  return <p className="registerWithMail">{text}</p>;
}

function Signupform({
  firstname,
  setfirstname,
  secondname,
  setsecondname,
  email,
  setemail,
  password,
  setpassword,
  onSubmit,
}) {
  return (
    <form className="signupForm" onSubmit={onSubmit}>
      <div className="fieldGrid">
        <Firstname firstname={firstname} setfirstname={setfirstname} />
        <Secondname secondname={secondname} setsecondname={setsecondname} />
      </div>

      <Email email={email} setemail={setemail} />
      <Password password={password} setpassword={setpassword} />

      <button type="submit" className="hiddenSubmit">
        Submit
      </button>
    </form>
  );
}

function Signupbutton({ text }) {
  return (
    <button type="submit" className="primaryBtn">
      {text}
    </button>
  );
}

function Rightpanelimage() {
  return (
    <div className="rightImageWrap">
      <div className="rightImagePlaceholder">Image</div>
    </div>
  );
}

function Rightpanel({ title, body }) {
  return (
    <div className="rightText">
      <h2 className="rightTitle">{title}</h2>
      <p className="rightBody">{body}</p>
    </div>
  );
}

function Rightpaneldash({ total = 3, activeIndex = 0 }) {
  const dots = Array.from({ length: total });
  return (
    <div className="dots">
      {dots.map((_, i) => (
        <span key={i} className={`dot ${i === activeIndex ? "dotActive" : ""}`} />
      ))}
    </div>
  );
}

function Firstname({ firstname, setfirstname }) {
  return (
    <label className="field">
      <span className="label">First name</span>
      <input
        value={firstname}
        onChange={(e) => setfirstname(e.target.value)}
        placeholder="First name"
        autoComplete="given-name"
      />
    </label>
  );
}

function Secondname({ secondname, setsecondname }) {
  return (
    <label className="field">
      <span className="label">Second name</span>
      <input
        value={secondname}
        onChange={(e) => setsecondname(e.target.value)}
        placeholder="Second name"
        autoComplete="family-name"
      />
    </label>
  );
}

function Email({ email, setemail }) {
  return (
    <label className="field">
      <span className="label">Email</span>
      <input
        value={email}
        onChange={(e) => setemail(e.target.value)}
        placeholder="email"
        type="email"
        autoComplete="email"
      />
    </label>
  );
}

function Password({ password, setpassword }) {
  return (
    <label className="field">
      <span className="label">Password</span>
      <input
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        placeholder="password"
        type="password"
        autoComplete="new-password"
      />
    </label>
  );
}
