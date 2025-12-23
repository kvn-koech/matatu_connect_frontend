import React, {useState} from "react";
import matatuIcon from "../assets/Matatu_icon.png";
function LoginPage(){
const [username,setUsername]=useState("");
const [password,setPassword]=useState("");
const [role,setRole]=useState("commuter");

    return(
   <div>
    <LoginCard username={username} setUsername={setUsername} password={password} setPassword={setPassword} role={role} setRole={setRole}/>
   </div>
    )}

export default LoginPage;

function LoginCard({username,setUsername,password,setPassword,role,setRole,title,setTitle,subTitle,setSubTitle}){
    return(
        <div>
        <BrandHeader title="Matatu Connect" subTitle="Welcome Back, please login to continue" iconsrc={matatuIcon}/>
        <RoleSwitcher role={role} setRole={setRole} />
        <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>
        <Divider/>
        <GoogleButton/>
        <SignupPrompt/>
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
    fontFamily: "system-ui, Arial, sans-serif",
    fontSize: "16px",
  };

    const buttonStyle = {
    fontFamily: "inherit",
    fontSize: "inherit",
    padding: "8px 12px",
    marginRight: "8px",
    cursor: "pointer",
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

function LoginForm({username,setUsername,password,setPassword,role}){
    const [error,setError]=useState("");
    const isValid=username.trim() !=="" && password.trim()=="";
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
    }
    return(
        <form onSubmit={handleSubmit}>
        <UsernameInput username={username} setUsername={setUsername} />
        <PasswordInput password={password} setPassword={setPassword} />
        <ForgotPasswordLink />
        <LoginButton disabled={!isValid}/>
        </form>
    );
}

function Divider(){
    return (
        <div>Divider</div>
    );
}

function GoogleButton(){
    return(
        <div>GoogleButton</div>
    );
}

function SignupPrompt(){
    return(
        <div>
            <p>Don't have an account</p>
            <button type="button">Sign up</button>
        </div>
    );
}

function UsernameInput({username , setUsername}){
    return(
        <input type="text" value={username} onChange={(e)=>setUsername (e.target.value)} placeholder="Username"/>
    );
}

function PasswordInput({password , setPassword}){
    return(
        <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Password"/>
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