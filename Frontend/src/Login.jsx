import { useState } from "react";
import "./Login.css";

function Login({onLogin, goToRegister}){
    const [email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");

    const handleLogin = async() => {
        try{
            const res = await fetch("http://localhost:8080/api/auth/login",{
               method: "POST",
               headers: {"Content-Type": "application/json"},
               body: JSON.stringify({email, password}) 
            });
            const data = await res.json();
            if(data.error) return setError(data.error);
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            onLogin();
        }catch(err){
            setError("Something went wrong");
        }
    };

    return(
        <div className="authPage" >
            <div className="authBox">
                <h2>Welcome Back</h2>
                <p className="authSub">Log in to SigmaGPT</p>
                {error && <p className="authError">{error}</p>}
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}/>
                <button className="authBtn" onClick={handleLogin}>Log In</button>
                <p className="authSwitch">Don't have an account? <span onClick={goToRegister}>Register</span></p>
            </div>
        </div>
    )
}

export default Login;