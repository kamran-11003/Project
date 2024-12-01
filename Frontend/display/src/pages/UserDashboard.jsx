import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';
import PickupDropOffComponent from '../components/PickupDropOffComponent';
import RideSelector from '../components/RideSelector';

const UserDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [dropOff, setDropOff] = useState('');
  const [selectedRide, setSelectedRide] = useState('');

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
    padding: '40px',
    overflowY: 'auto',
  },
};

export default UserDashboard;
