import {useContext} from "react";
import "./priceconfirmation.css";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../../Helper/FlightContext";
//import { useContext } from "react";
//import { Info } from "../../Helper/helper";
function Priceconfirmationpage(){
   
   const navigate = useNavigate();
   const {flightDetails} = useContext(FlightContext);

   function displayLayovers(layovers){
      return layovers === 0 ? "Non-Stop" : `${layovers} Layovers`;
    }

   function handleClick(e){
      e.preventDefault();
      navigate('/selecttraveller');
   }

    return(
        <div className="back">
           <div><h1 className="title">Review & Traveller Details</h1></div>
         <div className="flight-info">
             <div>
                  <p className="locations">{flightDetails.startingCity}<span> → </span>{flightDetails.destinationCity}<br/>
                     <span className="info">{flightDetails.travelDate}, {displayLayovers(flightDetails.layovers)},{flightDetails.duration},Economy</span>
                  </p>
              </div>
             <div>
                  <p><span><img className="img" src="https://images.ixigo.com/img/common-resources/airline-new/AI.png" alt="flightimg" /></span> {flightDetails.companyName} | {flightDetails.flightNumber} </p>
                </div>
             <div className="flight-details">
                 <div className="section1">
                 <h3>{flightDetails.travelDate}</h3>
                 <p><strong>{flightDetails.startTime}</strong> - {flightDetails.startingCity}</p>
                 <p>Indira Gandhi Intl Airport</p>
                 <p>Terminal 3</p>
                  </div>
                  <div className="duration">
                     <p><span>{flightDetails.duration}</span><hr/>{displayLayovers(flightDetails.layovers)}</p>
                   </div>
                  <div className="section2">
                     <h3>{flightDetails.travelDate}</h3>
                      <p><strong>{flightDetails.endTime}</strong> -{flightDetails.destinationCity}</p>
                     <p>Chatrapati Shivaji International Airport</p>
                     <p>Terminal 2</p>
                    </div>
                  <div className="baggage-info">
                     <h3>Baggage</h3>
                     <p>Per Traveller</p>
                   </div>
                  <div className="cabin-info">
                     <h3>Cabin</h3>
                     <p>7 Kg (1 piece per pax)</p>
                  </div>
                  <div className="checkin-info">
                     <h3>Check-in</h3>
                     <p>15 Kilograms (1 piece per pax)</p>
                   </div>
                </div>
            </div>
          <div className="fare-summary">
             <div className="fare-item">
                 <div className="fare-description">Fare Summary</div>
                 <div className="fare-amount">1 Traveller </div>
                </div>
             <div className="fare-item">
                  <div className="fare-description">Fare Type</div>
                  <div className="fare-amount">Partially Refundable</div>
                </div>
             <div className="fare-item">
                 <div className="fare-description">Base Fare</div>
                 <div className="fare-amount">{flightDetails.pricePerSeat}</div>
             </div>
              <div className="fare-total">
                   <div className="fare-description">Total Amount</div>
                   <div className="fare-amount">{flightDetails.pricePerSeat}</div>
              </div>
              <div className="fare-amount"><button className="continue-button" id="continueButton" onClick={handleClick}>Continue</button></div>
           </div>
        </div>
    );
}
export default Priceconfirmationpage;

