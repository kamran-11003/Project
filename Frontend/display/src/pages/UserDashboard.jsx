import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';
import PickupDropOffComponent from '../components/PickupDropOffComponent';

const UserDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [dropOff, setDropOff] = useState('');

  const handleSetPickupAndDropOff = (pickupLocation, dropOffLocation) => {
    setPickup(pickupLocation);
    setDropOff(dropOffLocation);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        
        <MapComponent pickup={pickup} dropOff={dropOff} />
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
  heading: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
  },
};

export default UserDashboard;
