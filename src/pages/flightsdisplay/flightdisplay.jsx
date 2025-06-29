import React, { useState, useEffect } from "react";
import Flightcard from "./flightcard";
import { useLocation} from "react-router-dom";


function Flightsdisplay() {
  //const {allInf,setAllInf} = useContext(Info);
  const location = useLocation();
  const searchInf = location.state;
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/flights/search",{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(searchInf),
        });
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error("Failed to fetch flighths:", error);
      }
    };

    fetchFlights();
  }, [searchInf]);

  return (
    <div>
      {flights.length > 0 ? (
        flights.map((flight) => (
          <Flightcard 
            key={flight._id}
            id={flight._id}
            companyName={flight.companyName}
            flightNumber={flight.flightNumber}
            startTime={new Date(flight.startTime).toLocaleTimeString()}
            duration={`${Math.floor((new Date(flight.endTime)-new Date(flight.startTime))/60000)} min`}
            layovers={flight.layovers}
            endTime={new Date(flight.endTime).toLocaleTimeString()}
            pricePerSeat={`Rs. ${flight.pricePerSeat}`}
            startingCity={flight.startingCity}
            destinationCity={flight.destinationCity}
            travelDate={new Date(flight.travelDate).toLocaleDateString()}
          />
        ))
      ):(
        <p>No flights found 😔</p>
      )}
    </div>
  );
}
export default Flightsdisplay;
