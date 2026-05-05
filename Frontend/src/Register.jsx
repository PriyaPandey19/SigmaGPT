import {useState} from "react";
import "./Login.css";

function Register({goToLogin}){
    const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");
    const[success, setSuccess] = useState("");

    const handleRegister = async() => {
        try{
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, email, password})
            });
            const data = await res.json();
            if(data.error) return setError(data.error);
            setSuccess("Account created! Please Log in.");
            setTimeout(() => goToLogin(), 1500);
        }catch(err){
            setError("Something went wrong");
        }
    };

    return(
        <div className="authPage">
            <div className="authBox">
                <h2>Create Account</h2>
                <p className="authSub">Join SigmaGPT</p>
                {error && <p className="authError">{error}</p>}
                {success && <p className="authSuccess">{success}</p>}
                <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRegister()}/>
                <button className="authBtn" onClick={handleRegister}>Register</button>
                <p className="authSwitch">Already have an account? <span onClick={goToLogin}>Log In</span></p>
            </div>
        </div>
    )
}
export default Register;