import React from "react";
import "./Navbar.css";
import {NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../auth/useAuthContext";
import { useLogout } from "../../Helper/useLogout";
const Navbar = () => {

    const {isAuthenticated} = useAuthContext();
    const {logout} = useLogout();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
    }
    const handleCheckInClick = (e) => {
        if(!isAuthenticated){
            e.preventDefault();
            alert('Login to your account for Web Check-in');
            navigate('/login');
        }
    }

    return(
        <div className="navbar">
            <div className="airlines">
                <h3>@ApnaFlights</h3>
            </div>
            <div className="paths">
                <ul>
                    <NavLink to = '/' className="nav-link"><li>Home</li></NavLink>
                    {isAuthenticated ? <NavLink to = '/profile' className="nav-link"><li>profile</li></NavLink> : ''}
                    <NavLink to = '/checkin' className="nav-link"><li>Check-in</li></NavLink>
                    {isAuthenticated ? <NavLink to = './login' onClick={handleLogout} className="nav-link"><li>Logout</li></NavLink> : <NavLink to = './login' className="nav-link"><li>Log-in</li></NavLink> }
                    
                </ul>
                
            </div>
        </div>
    )
}
export default Navbar;