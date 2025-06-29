import React, { useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../../Helper/FlightContext';
import './checkin.css';
const CheckInForm = () => {
  const navigate = useNavigate();
  const {pnr, setPnr} = useContext(FlightContext);
  const {lastName, setLastName} = useContext(FlightContext);

  useEffect(() => {

    const savedPnr = localStorage.getItem('pnr');
    const savedLastName = localStorage.getItem('lastName');
    if (savedPnr) setPnr(savedPnr);
    if(savedLastName) setLastName(savedLastName);
  },[setPnr,setLastName]);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/CheckInDetails');
  };

  return (
    <div className="checkin-page-wrapper">
      <div className="content-checkin">
        <h1>Web Check-In</h1>
        <p>Web Checkin for passengers is available 48 hrs to 60 mins before domestic flight departure, and 24 hrs to 75 mins before international flight departure.</p>
        <form onSubmit={handleSubmit}>
          <label className="label-checkin" htmlFor="bookingId">PNR/Booking Reference:</label>
          <input
            type="text"
            id="bookingId"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            required
          />
          <label className="label-checkin" htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <button className="button-checkin" type="submit">Check-In</button>
        </form>
      </div>
    </div>
  );
};

export default CheckInForm;
