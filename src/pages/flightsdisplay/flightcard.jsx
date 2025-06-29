import {useContext} from "react";
import propTypes from 'prop-types';
import "./flightdisplay.css";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../../Helper/FlightContext";
//import { useContext } from "react";
//import details from "./flightdetails";
//import { Info } from "../../Helper/helper"
function Flightcard(props) {
  // const {allInf,setAllInf} = useContext(Info);
  
  const navigate = useNavigate()
  const { flightDetails, setFlightDetails } = useContext(FlightContext);
  const handleBookClick = () => {
    // const flightDetails = {
    //   id: props.id,
    //   companyName: props.companyName,
    //   flightNumber: props.flightNumber,
    //   startTime: props.startTime,
    //   duration: props.duration,
    //   layovers: props.layovers,
    //   endTime: props.endTime,
    //   pricePerSeat: props.pricePerSeat,
    //   startingCity: props.startingCity,
    //   destinationCity: props.destinationCity,
    //   travelDate: props.travelDate,
    // }
    setFlightDetails({...props});
    navigate('/priceconfirmationpage');
  };

  function displayLayovers(layovers){
    return layovers === 0 ? "Non-Stop" : `${layovers} Layovers`;
  }
  
  return (
    <div className="card">
      <div className="con">
        <div className="col0">
           <h4 className="air">
              {props.companyName}<br />
              <span className="flightnum">{props.flightNumber}</span>
           </h4>
        </div>
        <div className="col1">
          <img className="img" src="https://images.ixigo.com/img/common-resources/airline-new/AI.png" alt="flightimg" />
        </div>
        <div className="col2">
          <p className="location">
            {props.startTime}
            <br />
            <span className="city">{props.startingCity}</span>
          </p>
        </div>
        <div className="col3">
          <p className="time">
            {props.duration}
            <hr />
            <span>{displayLayovers(props.layovers)}</span>
          </p>
        </div>
        <div className="col4">
          <p className="location">
            {props.endTime}
            <br />
            <span className="city">{props.destinationCity}</span>
          </p>
        </div>
        <div className="col5">
          <p className="price">{props.pricePerSeat}</p>
        </div>
        <div className="col6">
          <button className="btn" onClick={() => handleBookClick() }>Book</button>
        </div>
      </div>
    </div>
  );
}

Flightcard.propTypes = {
  id: propTypes.string.isRequired,
  companyName: propTypes.string.isRequired,
  flightNumber: propTypes.string.isRequired,
  startTime: propTypes.string.isRequired,
  duration: propTypes.string.isRequired,
  layovers: propTypes.number.isRequired,
  endTime: propTypes.string.isRequired,
  pricePerSeat: propTypes.string.isRequired,
  startingCity: propTypes.string.isRequired,
  destinationCity: propTypes.string.isRequired,
  travelDate: propTypes.string.isRequired,
};

export default Flightcard;