
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightContext } from '../../Helper/FlightContext';
import './itinerary.css';
function Itinerary() {
  const navigate = useNavigate();
  // const { allInf,setAllInf } = useContext(Info);
  const {flightInfo} = useContext(FlightContext);
  // const [baggage, setBaggage] = useState('none');
  const {baggage, setBaggage} = useContext(FlightContext);

  const handleChange = (e) => {
    e.preventDefault();
    setBaggage(e.target.value)
  }

  const startTime = new Date(flightInfo.flightId.startTime).toLocaleTimeString() ;
  const endTime = new Date(flightInfo.flightId.endTime).toLocaleTimeString();
  
  const handleSelectSeat = () => {
    navigate('/seatselection');
  };

  const handleContinue = () => {
    navigate('/Confirmation');
  };

  return (
    <div >
      <div className="container-itinerary">
        <div className="content-itinerary">
          <div className="itinerary">
            <h2>View Your Itinerary</h2>
            <div >
              <div className="detail">{flightInfo.flightId.startingCity} to {flightInfo.flightId.destinationCity}</div>
              <div className="detail">
                <span>{startTime}</span> <span>{endTime}</span> <span>{flightInfo.flightId.flightNumber}</span>
              </div>
              <div className="detail">{flightInfo.flightId.lastname}</div>
              <div className="detail">Seat: {flightInfo.selectedSeat || 'Unassigned'}</div>
            </div>
            <div className="formGroup">
              <label htmlFor="baggage">Additional Baggage:</label>
              <select
                id="baggage"
                name="baggage"
                value={baggage}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="<10kg">10 kgs</option>
                <option value="<20kg">20 kgs</option>
              </select>
            </div>
            {flightInfo.selectedSeat === null && (<div className="buttons-itinerary">
              <button className="selectSeat" onClick={handleSelectSeat}>Select/Change Seat</button>
            </div>)}
            <div className="buttons-itinerary">
              <button className="continue" onClick={handleContinue}>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itinerary;