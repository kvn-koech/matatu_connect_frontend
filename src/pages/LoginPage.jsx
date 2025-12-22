import React, {useState} from "react";

function LoginPage(){
const [username,setUsername]=useState("");
const [password,setPassword]=useState("");
    return(
   <div>
    <LoginCard username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
   </div>
    )}

export default LoginPage;

function LoginCard({username,setUsername,password,setPassword}){
    return(
        <div>
        <BrandHeader/>
        <RoleSwitcher/>
        <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>
        <Divider/>
        <GoogleButton/>
        <SignupPrompt/>
        </div>
    );
}

function BrandHeader(){
    return(
        <div>BrandHeader</div>
    );
}

function RoleSwitcher(){
    return(
        <div>RoleSwitcher</div>
    );
}

function LoginForm({username,setUsername,password,setPassword}){
    function handleSubmit(e){
        e.preventDefault();
        console.log(username,password)
    }
    return(
        <form onSubmit={handleSubmit}>
        <UsernameInput username={username} setUsername={setUsername} />
        <PasswordInput password={password} setPassword={setPassword} />
        <ForgotPasswordLink />
        <LoginButton />
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

function LoginButton(){
    return(
        <button type="submit">Login</button>
    );
}