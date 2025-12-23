import "../index.css";
import React, {useState} from "react";
import matatuIcon from "../assets/Matatu_icon.png";
import googleIcon from "../assets/google_icon.png";
import padlockIcon from "../assets/padlock_icon.png";
import personIcon from "../assets/person_Icon.png";

function LoginPage(){
const [username,setUsername]=useState("");
const [password,setPassword]=useState("");
const [role,setRole]=useState("commuter");


    return(
   <div className="page">
    <div className="card">
    <LoginCard username={username} setUsername={setUsername} password={password} setPassword={setPassword} role={role} setRole={setRole}/>
   </div>
   </div>
    )}

export default LoginPage;

function LoginCard({username,setUsername,password,setPassword,role,setRole,title,setTitle,subTitle,setSubTitle}){
    return(
        <div className="page-center">
        <BrandHeader title="Matatu Connect" subTitle="Welcome Back, please login to continue" iconsrc={matatuIcon}/>
        <RoleSwitcher role={role} setRole={setRole} />      
        <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        <Divider/>
        <GoogleButton iconsrc={googleIcon } setUsername={setUsername}  setPassword={setPassword}/>
        <SignupPrompt/>
        <SignupGoogle />
        </div>
    );
}

function BrandHeader({title,subTitle,iconsrc}){
    return(
        <header> 
            <h2>{title}</h2>
            <img src={iconsrc} alt="Matatu icon" />
            <p>{subTitle}</p>
        </header>
    );
}

function RoleSwitcher({role,setRole}){
    const containerStyle = {
    fontFamily: "system-ui, Arial, sans-serif",fontSize: "16px"
  };

    const buttonStyle = {fontFamily: "inherit",fontSize: "inherit",padding: "8px 12px",marginRight: "8px",cursor: "pointer",
  };

    const activeButtonStyle = {
    ...buttonStyle,
    fontWeight: 700,
  };
    return(
        < div style={containerStyle}>
        <button type="button" onClick={()=>setRole("commuter")} style={role === "commuter" ? activeButtonStyle : buttonStyle}>Commuter</button>
        <button type="button" onClick={()=>setRole("driver")} style={role === "driver" ? activeButtonStyle : buttonStyle}>Driver</button>
        <button type="button" onClick={()=>setRole("sacco_manager")} style={role === "sacco_manager" ? activeButtonStyle : buttonStyle}>Sacco_manager</button>
         <p>Selected: {role}</p>
        </div>
    );
}

function LoginForm({username,setUsername,password,setPassword,role ,iconsrc1=padlockIcon, iconsrc2=personIcon}){
    const [error,setError]=useState("");
    const isValid=username.trim() !=="" ;
    function handleSubmit(e){
        e.preventDefault();
        if(username.trim()===""&& password.trim()===""){
            setError("Username and passowrd are required");
            return;
        }
        if(username.trim()===""){
            setError("username is required");
            return;
        }
        if(password.trim()===""){
            setError("password is required");
            return;
        }
        setError("");
        console.log(username,password,role);
        setUsername("");
        setPassword("");
    }
    return(
        <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <UsernameInput username={username} setUsername={setUsername} iconSrc={iconsrc2}  />
        
        <PasswordInput password={password} setPassword={setPassword} iconSrc={iconsrc1} />
        
        </div>
        <ForgotPasswordLink />
        <LoginButton disabled={!isValid}/>
        </form>
    );
}

function Divider(){
    return (
        <div
        style={{display: "flex",alignItems: "center",gap: "12px",margin: "16px 0",width: "100%",
        }}
        >
      <span style={{ flex: 1, height: "1px", background: "#d0d0d0" }} />
      <span style={{ fontSize: "14px", color: "#666" }}>or</span>
      <span style={{ flex: 1, height: "1px", background: "#d0d0d0" }} />
    </div>  
    );
    }

function GoogleButton({iconsrc,setUsername, setPassword}){
    function handleGoogleClick() {
    setUsername("");
    setPassword("");
    }
    return(
        <button
          type="button"style={{display: "flex",alignItems: "center",gap: "8px",padding: "8px 12px",cursor: "pointer"
          }}
        >
          <img
            src={iconsrc}alt="Google icon" style={{ width: "15px", height: "18px" }}
          />
          Sign in with Google
        </button>
    );
}
function SignupGoogle(){
    return(
        <div>Click to sign in with Google</div>
    )
}
function SignupPrompt(){
    return(
        <div>
            <p>Don't have an account</p>
            <button type="button">Sign up</button>
        </div>
    );
}

function UsernameInput({ username, setUsername, iconSrc }) {
  return (
    <div className="input-wrap">
      <img className="input-icon" src={iconSrc} alt="" />
      <input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
    </div>
  );
}

function PasswordInput({ password, setPassword, iconSrc }) {
  return (
    <div className="input-wrap">
      <img className="input-icon" src={iconSrc} alt="" />
      <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
      />
    </div>
  );
}
function ForgotPasswordLink(){
    return(
        <div>ForgotPasswordLink</div>
    );
}

function LoginButton({disabled}){
    return(
        <button type="submit" disabled={disabled}>Login</button>
    );
}