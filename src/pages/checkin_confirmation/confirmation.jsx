
import React, {useContext, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { FlightContext } from '../../Helper/FlightContext';
//import { Info } from '../../Helper/helper';
import './confirmation.css';
function Confirmation() {
  //const { allInf } = useContext(Info);
  const { flightInfo, baggage } = useContext(FlightContext);
  // const email = flightInfo.traveller.email ;
  const navigate=useNavigate();
  const handleOnClick = () => {
    navigate('/'); 
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/send-email',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightInfo: flightInfo,
          baggage: baggage,
        }),
      });

      const data = await response.json();
      if(response.ok) {
        alert('Email sent successfully');
      } else {
        alert(`Error: ${data.message}`);
      }

    } catch (error) {
      console.error('Error sending email: ', error);
      alert('Error sending email');
    }
  };

  const startTime = new Date(flightInfo.flightId.startTime).toLocaleTimeString() ;
  const endTime = new Date(flightInfo.flightId.endTime).toLocaleTimeString();
 

  return (
    <div className="container-confirm">
      <header className="header-confirm">
        <h1>Check-In</h1>
      </header>
      <section className="confirmation">
        <h2>Check-In Confirmation</h2>
        <div id="confirmationMessage" className="confirmation-message"></div>
        <div className="flight-info">
          <h3>Flight Information</h3>
          <div className="info-item"><strong>Flight Number:</strong> <span id="flightNumber">{flightInfo.flightId.flightNumber}</span></div>
          <div className="info-item"><strong>Departure:</strong> <span id="departure">{flightInfo.flightId.startingCity}</span></div>
          <div className="info-item"><strong>Arrival:</strong> <span id="arrival">{flightInfo.flightId.destinationCity}</span></div>
          <div className="info-item"><strong>Departure Time:</strong> <span id="departureTime">{startTime}</span></div>
          <div className="info-item"><strong>Arrival Time:</strong> <span id="arrivalTime">{endTime}</span></div>
        </div>
        <div className="seat-selection">
          <h3>Seat Selection</h3>
          <div className="info-item"><strong>Selected Seat:</strong> <span id="selectedSeat">{flightInfo.selectedSeat}</span></div>
        </div>
        <div className="addons">
          <h3>Add-Ons</h3>
          <div className="info-item"><strong>Additional Baggage:</strong> <span id="baggage">{baggage}</span></div>
        </div>
        <div className="actions">
          <button  className="but" id="sendEmailButton" onClick={handleSendEmail}>Send Email</button>
          <button className="but" onClick={handleOnClick}>Home</button>
        </div>
      </section>
    </div>
  );
}

export default Confirmation;
