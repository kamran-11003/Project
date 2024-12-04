import React, { createContext, useState, useContext } from 'react';

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [pickup, setPickup] = useState(''); // Existing pickup location
  const [dropOff, setDropOff] = useState(''); // Existing drop-off location
  const [pickupCoordinates, setPickupCoordinates] = useState({ latitude: null, longitude: null }); // New pickup latitude and longitude
  const [dropOffCoordinates, setDropOffCoordinates] = useState({ latitude: null, longitude: null }); // New drop-off latitude and longitude
  const [selectedRide, setSelectedRide] = useState('');
  const [distance, setDistance] = useState(0); // in km
  const [fare, setFare] = useState(0);

  const value = {
    pickup,
    dropOff,
    pickupCoordinates,
    dropOffCoordinates,
    selectedRide,
    distance,
    fare,
    setPickup,
    setDropOff,
    setPickupCoordinates,
    setDropOffCoordinates,
    setSelectedRide,
    setDistance,
    setFare,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

export const useRideContext = () => useContext(RideContext);
