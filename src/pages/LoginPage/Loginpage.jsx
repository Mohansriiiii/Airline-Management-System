import {useState} from "react";
import { Link } from "react-router-dom";
import {useLogin} from "./useLogin"
import "./LoginPage.css";
import { useAuthContext } from "../../auth/useAuthContext";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginPage() {

  const {user} = useAuthContext()

  const {login,error} = useLogin()
  const [user1,setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({...user1, [name]:value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(user1);
  }
  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2 className="login-h2">Login</h2>
        <form  className="form-login"id="loginForm" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={user1.email} onChange={handleInput} required />

          <label className="login-label"htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              className="input-login"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={user1.password}
              onChange={handleInput}
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
          <button className="LoginButton" type="submit">
            Login
          </button>
        </form>
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign up here </Link>
        </p>
        {error && <div className='error'>{error}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
