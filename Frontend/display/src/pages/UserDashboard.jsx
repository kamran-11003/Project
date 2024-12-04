// components/UserDashboard.js
import React, { useEffect } from 'react';
import { useRideContext } from '../context/rideContext'; // Import the ride context
import { useSocket } from '../context/SocketContext'; // Import the SocketContext
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
  } = useRideContext(); // Destructure ride context values

  const { userId, socket } = useSocket(); // Get userId and socket from SocketContext

  const handleSetPickupAndDropOff = (pickupLocation, dropOffLocation) => {
    setPickup(pickupLocation);
    setDropOff(dropOffLocation);
  };

  const handleSelectRide = (rideType) => {
    setSelectedRide(rideType);

  };

  useEffect(() => {
    if (socket && userId) {
      socket.emit('userConnected', { userId }); // Notify the server user has connected

    
      // Cleanup the socket listener when component unmounts
      return () => {
        socket.off('rideRequest');
      };
    }
  }, [socket, userId]);

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
