import { useState } from "react";
import axios from "axios";
import "./signup_page.css"
import {Link, useNavigate } from "react-router-dom"
import {useSignup} from "./useSignup"
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Signup_page(){
    const {signup,error} = useSignup();
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleInput = e => {
        const {name,value} = e.target ;
        setUser({ ...user, [name]: value})
     } ;

    const handleSubmit = async e => {
        e.preventDefault();
        const success = await signup(user);
        if(success){
            navigate("/login",{replace:true});
            setUser({
                username: "",
                email:"",
                password: "",
            });
        }else{
            console.log(e);
        }
    }

    return(
        <div className="signup-page-wrapper">
            <div className="signup-container">
                <h2 className="h2">Create an Account</h2>
                <form className="form" id="signupForm" onSubmit={handleSubmit} >
                    <label className="label"htmlFor="username">Username:</label>
                    <input className="input"type="text" id="username" value={user.username} onChange={handleInput} name="username" required />
            
                    <label className="label"htmlFor="email">Email:</label>
                    <input className="input"type="email" id="email" value={user.email} onChange={handleInput} name="email" required />
            
                    <label className="label-"htmlFor="password">Password:</label>
                    <div className="password-input-container">
                      <input
                        className="input"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={user.password}
                        onChange={handleInput}
                        name="password"
                        required
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(v => !v)}
                        className="password-toggle-button"
                      >
                        {showPassword ? (
                          <FaEyeSlash style={{ transform: 'translateY(2px)' }} />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </div>
                    <button className="SignupButton" type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
                {error && <div className='error'>{error}</div>}
            </div>
        </div>
    );
}

export default Signup_page