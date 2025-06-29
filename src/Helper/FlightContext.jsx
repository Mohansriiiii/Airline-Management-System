// FlightContext.js
import React, { createContext, useEffect, useState } from 'react';

export const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flightDetails, setFlightDetails] = useState(() => {
    const savedFlightDetails = sessionStorage.getItem('flightDetails');
    return savedFlightDetails ? JSON.parse(savedFlightDetails) : {} ;
  });
  const [traveller, setTraveller] = useState(() => {
    const savedTraveller = sessionStorage.getItem('traveller');
    return savedTraveller ? JSON.parse(savedTraveller) : {} ;
  });
  const [selectedSeat, setSelectedSeat] = useState( () => {
    const savedSelectedSeat = sessionStorage.getItem('selectedSeat');
    return savedSelectedSeat ? (savedSelectedSeat) : '' ;
  });
  const [pnr, setPnr] = useState( () => {
    const savedPnr = sessionStorage.getItem('pnr');
    return savedPnr ? (savedPnr) : '' ;
  });
  const [lastName, setLastName] = useState(() => {
    const savedLastName = sessionStorage.getItem('lastName');
    return savedLastName ? (savedLastName) : '' ;
  });
  const [flightInfo, setFlightInfo] = useState(() => {
    const savedFlightInfo = sessionStorage.getItem('flightInfo');
    return savedFlightInfo ? JSON.parse(savedFlightInfo) : {} ;
  });
  const [baggage, setBaggage] = useState(() => {
    const savedBaggage = sessionStorage.getItem('baggage');
    return savedBaggage ? (savedBaggage) : 'none' ;
  });

  useEffect(()=> {
    sessionStorage.setItem('flightDetails', JSON.stringify(flightDetails));
  }, [flightDetails]);

  useEffect(() => {
    sessionStorage.setItem('traveller', JSON.stringify(traveller));
  }, [traveller]);

  useEffect(() => {
    sessionStorage.setItem('selectedSeat', selectedSeat);
  }, [selectedSeat]);

  useEffect(() => {
    sessionStorage.setItem('pnr', pnr);
  }, [pnr]);

  useEffect(() => {
    sessionStorage.setItem('lastName', lastName);
  }, [lastName]);

  useEffect(() => {
    sessionStorage.setItem('flightInfo', JSON.stringify(flightInfo));
  }, [flightInfo]);

  useEffect(() => {
    sessionStorage.setItem('baggage', baggage);
  }, [baggage]);

  return (
    <FlightContext.Provider value={{ 
        flightDetails, setFlightDetails,
        traveller, setTraveller, 
        selectedSeat, setSelectedSeat, 
        pnr, setPnr, 
        lastName, setLastName, 
        flightInfo, setFlightInfo, 
        baggage, setBaggage 
    }}>
      {children}
    </FlightContext.Provider>
  );
};
