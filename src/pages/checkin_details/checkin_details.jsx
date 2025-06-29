import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../../Helper/FlightContext";
import './checkin_details.css';
// import { Info } from '../../Helper/helper';
// import { useContext } from 'react';
const CheckInDetails = () => {
  const navigate = useNavigate();
  // const {allInf} = useContext(Info);
  // const {state} = useLocation();
  const { pnr, lastName, flightInfo, setFlightInfo } = useContext(FlightContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchFlightInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/checkin-details', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pnr: pnr, lastName: lastName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.message || 'Error fetching flight details');
        }

        const data = await response.json();

        const travelDate = new Date(data.flightId.travelDate).toLocaleDateString();

        console.log(data);
        setFlightInfo({...data, flightId:{...data.flightId, travelDate}});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightInfo();
  }, [pnr, lastName, setFlightInfo]);

  const handleContinue = () => {
    navigate("/Itinerary");
  };

  const displayLayovers = (layovers) => {
    return layovers === 0 ? "Non-Stop" : `${layovers} Layovers`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!flightInfo) {
    return <div>No flight details found</div>;
  }


  return (
    <div className="container-Details">
      <header>
        <div className="navbar-Details">
          <div className="right-section">
            <div className="user-login">
              <p>
                Welcome, {flightInfo.traveller?.firstName}{" "}
                {flightInfo.traveller?.lastName}
              </p>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="flight-info-d">
          <div className="flight-details-d">
            <div className="flight-route">
              <span className="info-label-d">  
                Flight-Details: 
                <br/>
               </span>&nbsp;&nbsp;
              <br />
              <br/>
              <span className="airport-code">
                {flightInfo.flightId?.companyName}
              </span>
              <span className="airport-code">
                {flightInfo.flightId?.flightNumber}
              </span>
            </div>
            <div className="flight-destination">
              <span className="flight-date-info">{flightInfo.flightId?.startingCity}</span>
              <span> -- </span>
              <span className="flight-date-info">{flightInfo.flightId?.destinationCity}</span>
            </div>
          </div>
          <br />
          <div className="flight-date-d">
            <div className="flight-date-item">
              <span className="flight-date-info">Date:  </span>&nbsp;&nbsp;
              <span className="flight-date-info">{flightInfo.flightId?.travelDate}</span>
            </div> 
          </div>
          <br />
          <div className="passenger-info-d">
            <div className="passenger-info-item">
              <span className="flight-date-info">Layovers:  </span>&nbsp;&nbsp;
              <span className="flight-date-info">{displayLayovers(flightInfo.flightId?.layovers)}</span>
            </div>
          </div>
        </div>
        <div className="check-in-form">
          <label htmlFor="nameInput" className="info-label">
            Name:
          </label>
          <input
            type="text"
            id="nameInput"
            placeholder="Enter your name"
            value={`${flightInfo.traveller?.firstName} ${flightInfo.traveller.lastName}`}
            readOnly
          />
          <button onClick={handleContinue}>CONTINUE</button>
        </div>
      </main>
    </div>
  );
};

export default CheckInDetails;
