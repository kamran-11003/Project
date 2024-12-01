import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';
import PickupDropOffComponent from '../components/PickupDropOffComponent';
import RideSelector from '../components/RideSelector';
import FareEstimator from '../components/FareEstimator';

const UserDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [dropOff, setDropOff] = useState('');
  const [selectedRide, setSelectedRide] = useState('');
  const [distance, setDistance] = useState(0); // Distance in km

  const handleSetPickupAndDropOff = (pickupLocation, dropOffLocation) => {
    setPickup(pickupLocation);
    setDropOff(dropOffLocation);
    calculateDistance(pickupLocation, dropOffLocation); // Call function to update distance
  };

  const handleSelectRide = (rideType) => {
    setSelectedRide(rideType);
  };

  const calculateDistance = (pickupLocation, dropOffLocation) => {
    const dummyDistance = 12; // Example distance in km
    setDistance(dummyDistance);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <MapComponent pickup={pickup} dropOff={dropOff} />
        
        <RideSelector 
          pickup={pickup} 
          dropOff={dropOff} 
          selectedRide={selectedRide} 
          onSelectRide={handleSelectRide} 
        />
        <PickupDropOffComponent onSetPickupAndDropOff={handleSetPickupAndDropOff} />
        
        {selectedRide && distance > 0 && (
          <FareEstimator rideType={selectedRide} distance={distance} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f9f9f9',
  },
  mainContent: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
  },
};

export default UserDashboard;
