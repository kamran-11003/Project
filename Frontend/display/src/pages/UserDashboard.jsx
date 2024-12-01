import React from 'react';
import { useRideContext } from '../context/rideContext'; // Import the context hook
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';
import PickupDropOffComponent from '../components/PickupDropOffComponent';
import RideSelector from '../components/RideSelector';
import FareEstimator from '../components/FareEstimator';

const UserDashboard = () => {
  const {
    pickup,
    dropOff,
    selectedRide,
    setPickup,
    setDropOff,
    setSelectedRide,
    distance
  } = useRideContext(); // Destructure values from the context

  const handleSetPickupAndDropOff = (pickupLocation, dropOffLocation) => {
    setPickup(pickupLocation);
    setDropOff(dropOffLocation);
  };

  const handleSelectRide = (rideType) => {
    setSelectedRide(rideType);
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
          <FareEstimator />
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
