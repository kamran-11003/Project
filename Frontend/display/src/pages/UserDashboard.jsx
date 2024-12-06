import React, { useState, useEffect } from 'react';
import { useRideContext } from '../context/rideContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';
import PickupDropOffComponent from '../components/PickupDropOffComponent';
import RideSelector from '../components/RideSelector';
import FareEstimator from '../components/FareEstimator';
import { Routes, Route, useNavigate } from "react-router-dom";
import ProfileUpdate from '../components/ProfileUpdate';
import RideHistory from '../components/RideHistory';
import RideMap from '../components/RideMap';

const UserDashboard = () => {
  const [driverLocation, setDriverLocation] = useState([73.0580, 33.6841]); // Example: Driver's location
  const {
    pickup,
    dropOff,
    selectedRide,
    setPickup,
    setDropOff,
    setSelectedRide,
    distance,
    pickupCoordinates,
    dropOffCoordinates,
    setPickupCoordinates,
    setDropOffCoordinates,
  } = useRideContext();
  const navigate = useNavigate();
  
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
      // Notify server of user connection
      socket.emit('userConnected', { userId });
  
      // Register listener for 'rideStarted'
      const handleRideStarted = (data) => {
        try {
          if (!data) {
            throw new Error('Invalid data received');
          }
          console.log('Ride request received:', data);
          navigate("/user-dashboard/ride");
        } catch (error) {
          console.error('Error handling rideStarted event:', error);
        }
      };
  
      socket.on('rideStarted', handleRideStarted);
  
      // Listen for driver's location updates
      const handleLocationUpdate = (newLocation) => {
        if (newLocation && Array.isArray(newLocation) && newLocation.length === 2) {
          setDriverLocation(newLocation); // Update the driver's location
        }
        console.log(driverLocation,pickupCoordinates,dropOffCoordinates);
      };

      socket.on('Location', handleLocationUpdate);

      // Cleanup on unmount or dependency change
      return () => {
        socket.off('rideStarted', handleRideStarted);
        socket.off('location', handleLocationUpdate); // Remove the location update listener
      };
    }
  }, [socket, userId, navigate,driverLocation]);

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
          <Route path="history" element={<RideHistory />} />
          <Route path="edit-profile" element={<ProfileUpdate />} />
          <Route path='ride' element={<RideMap driverLocation={driverLocation} pickup={[pickupCoordinates.longitude, pickupCoordinates.latitude]} dropOff={[dropOffCoordinates.longitude, dropOffCoordinates.latitude]} />} />
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
