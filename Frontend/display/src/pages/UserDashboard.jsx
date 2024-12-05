import React, { useEffect } from 'react';
import { useRideContext } from '../context/rideContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';
import PickupDropOffComponent from '../components/PickupDropOffComponent';
import RideSelector from '../components/RideSelector';
import FareEstimator from '../components/FareEstimator';
import { Routes, Route } from "react-router-dom";
import ProfileUpdate from '../components/ProfileUpdate';

const UserDashboard = () => {
  const {
    pickup,
    dropOff,
    selectedRide,
    setPickup,
    setDropOff,
    setSelectedRide,
    distance,
  } = useRideContext();

  const { userId, socket } = useSocket();

  const handleSetPickupAndDropOff = (pickupLocation, dropOffLocation) => {
    setPickup(pickupLocation);
    setDropOff(dropOffLocation);
  };

  const handleSelectRide = (rideType) => {
    setSelectedRide(rideType);
  };

  useEffect(() => {
    if (socket && userId) {
      socket.emit('userConnected', { userId });
      return () => {
        socket.off('rideRequest');
      };
    }
  }, [socket, userId]);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MapComponent pickup={pickup} dropOff={dropOff} />
                <RideSelector
                  pickup={pickup}
                  dropOff={dropOff}
                  selectedRide={selectedRide}
                  onSelectRide={handleSelectRide}
                />
                <PickupDropOffComponent
                  onSetPickupAndDropOff={handleSetPickupAndDropOff}
                />
                {selectedRide && distance > 0 && <FareEstimator />}
              </>
            }
          />
          <Route path="history" element={<h2>Ride History Page (To be implemented)</h2>} />
          <Route path="edit-profile" element={<ProfileUpdate />} />
          </Routes>
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
