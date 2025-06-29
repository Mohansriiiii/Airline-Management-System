import React  from "react";
import {useNavigate} from 'react-router-dom';
import Flightcard from "../flightsdisplay/flightcard";
import flightimg from './image.png';
import './Home.css';
// import { useAuthContext } from "../../auth/useAuthContext";

const Home = () =>{
    
    const navigate = useNavigate()
    const handleClick=() =>{
        // if(isAuthenticated){
        //     navigate("/searchflights");
        // }else{
        //     alert('Login to continue booking seemlessly');
        //     navigate("/login");
        // }
        navigate('/searchflights');
    };
    return(
        <div className="home-container">
            <div className="greetings">
                <h1>Travel World with Us...</h1>
                <p>Fly the friendly skies!<br/>Low fares, on time flights</p>
                <button className="book-btn" onClick={handleClick}>BOOK</button>
            </div>
        </div>
    )
}

export default Home;