import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
// import { Info } from "../../Helper/helper";
import './finalconfirmation.css';
import { FlightContext } from "../../Helper/FlightContext";
const Finalconfirmation = () =>{
    //const { allInf,setAllInf } = useContext(Info);
    const {flightDetails, traveller, selectedSeat} = useContext(FlightContext)
    const navigate = useNavigate()
    // const [done,setDone] = useState(false);
    // if(done){
    //     return navigate('/bookingsuccess')
    // }

    const handleClick = async () => {
      try {
        const response = await fetch('http://localhost:5000/book-flight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ flightId: flightDetails.id, traveller: traveller, selectedSeat: selectedSeat }), // Include the flightId in the body of the request
        });
  
        if (!response.ok) {
          throw new Error('Failed to book the flight');
        }
  
        const data = await response.json();
        alert('Flight booked successfully: ' + data.booking.pnr);
        navigate('/bookingsuccess')
      } catch (error) {
        alert('Error booking flight: ' + error.message);
      }
      
    }

    const displayLayovers = (layovers) => {
      return layovers === 0 ? "Non-Stop" : `${layovers} Layovers`;
    };

    return(
        <div className="body">
             <div><h1 className="title">Booking Details</h1></div>
              <div className="flight-info">
                 <div>
                     <p className="locations">{flightDetails.startingCity}<span> → </span>{flightDetails.destinationCity}<br/><span className="info">{flightDetails.travelDate}, {displayLayovers(flightDetails.layovers)},{flightDetails.duration}Economy</span></p>
                   </div>
                  <div>
                    <p><span><img className="img" src="https://images.ixigo.com/img/common-resources/airline-new/AI.png" alt="flightimg" /></span> {flightDetails.companyName} | {flightDetails.flightNumber}</p>
                  </div>
                 <div className="flight-details">
                      <div className="section1">
                          <h3>{flightDetails.travelDate}</h3>
                          <p><strong>{flightDetails.startTime}</strong> {flightDetails.startingCity}</p>
                          <p>Indira Gandhi Intl Airport</p>
                          <p>Terminal 3</p>
                       </div>
                       <div className="duration">
                          <p><span>{flightDetails.duration}</span><hr/>{displayLayovers(flightDetails.layovers)}</p>
                        </div>
                       <div className="section2">
                           <h3>{flightDetails.travelDate}</h3>
                           <p><strong>{flightDetails.endTime}</strong> {flightDetails.destinationCity}</p>
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
                </div >
               <div className="traveller-details">
                    <h3>Traveller Details</h3>
                    <p>Name: {traveller.firstName} {traveller.lastName}<br/>Email: {traveller.email}<br />Seat: {selectedSeat}</p>
               </div>
              <div><button className="confirm-button" id="conformButton"  onClick={handleClick}>Confirm</button></div>
        </div>
        
    )
}
export default Finalconfirmation;