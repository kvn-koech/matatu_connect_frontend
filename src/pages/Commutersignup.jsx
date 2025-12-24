import React, { useState } from "react";

function CommuterSignup(){
    const [firstname,setfirstname]=useState("");
    const [secondname,setsecondname]=useState("");
    const [email,setemail]=useState("");
    const[password,setpassword]=useState("");
    return <Commuter firstname={firstname} setfirstname={setfirstname} secondname={secondname} setsecondname={setsecondname} email={email} setemail={setemail} password={password} setpassword={setpassword} />
};

export default CommuterSignup;
function Commuter({firstname,setfirstname,secondname, setsecondname,email,setemail,password,setpassword}){
    return(
    <div>
    <MatatuConnect />
    <CreateAccount />
    <GoogleButton />
    <AppleButton />
    <RegisterwithMail />
    <Signupform firstname={firstname} setfirstname={setfirstname} secondname={secondname} setsecondname={setsecondname} email={email} setemail={setemail} password={password} setpassword={setpassword}/>
    <Signupbutton />
    <Rightpanelimage />
    <Rightpanel />
    <Rightpaneldash />
    
    </div>
);
}

function MatatuConnect(){
    return(
        <div>MatatuConnect</div>
    );
}

function CreateAccount(){
    return(
        <div>CreateAccount</div>
    );
}

function GoogleButton(){
    return (
        <div>Google Button</div>
    );
}

function AppleButton(){
    return (
        <div>Apple Button</div>
    );
}

function RegisterwithMail(){
    return(
        <div>Register with mail</div>
    );
}

function Signupform({firstname, setfirstname,secondname,setsecondname, email, setemail,password,setpassword}){
    return(
        <form>
        <div>
            <Firstname firstname={firstname} setfirstname={setfirstname} />
            <Secondname secondname={secondname} setsecondname={setsecondname}/>
            <Email email={email} setemail={setemail} />
            <Password password={password} setpassword={setpassword}  />
        </div>
        </form>
    );
}

function Signupbutton(){
    return(
        <div>signupbutton</div>
    );
}

function Rightpanelimage(){
    return(
        <div>image</div>
    );
}

function Rightpanel(){
    return(
        <div>blog</div>
    );
}

function Rightpaneldash(){
    return(
        <div>dash</div>
    );
}
function Firstname({firstname , setfirstname}){
    return(
        <input value={firstname} onChange={(e)=>setfirstname(e.target.value)} placeholder="First name" />
    );
}
function Secondname({secondname,setsecondname}){
    return(
        <input value={secondname} onChange={(e)=>setsecondname(e.target.value)} placeholder="Second name"  />
    );
}
function Email({email,setemail}){
    return(
        <input value={email} onChange={(e)=>setemail(e.target.value) } placeholder="email"/>
    );
}
function Password({password,setpassword}){
    return(
        <input value={password} onChange={(e)=>setpassword(e.target.value)} placeholder="password" />
    );
}
            