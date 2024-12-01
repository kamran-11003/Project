import React, { createContext, useState, useContext } from 'react';

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [pickup, setPickup] = useState('');
  const [dropOff, setDropOff] = useState('');
  const [selectedRide, setSelectedRide] = useState('');
  const [distance, setDistance] = useState(0); // in km
  const [fare, setFare] = useState(0);

  const value = {
    pickup,
    dropOff,
    selectedRide,
    distance,
    fare,
    setPickup,
    setDropOff,
    setSelectedRide,
    setDistance,
    setFare,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

export const useRideContext = () => useContext(RideContext);
