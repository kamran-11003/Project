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
import DriverData from '../components/DriverData';
import RideCompleted from '../components/RideComplete';
import CreateDisputeUser from '../components/CreateDisputeuser';

const UserDashboard = () => {
  const [driverLocation, setDriverLocation] = useState([73.0580, 33.6841]); // Example: Driver's location
  const [driver, setDriver] = useState({});

  const {
    pickup,
    dropOff,
    selectedRide,
    setPickup,
    setDropOff,
    setSelectedRide,
    distance,
    fare,
    pickupCoordinates,
    dropOffCoordinates,
    setPickupCoordinates,
    setDropOffCoordinates,
    setDistance,
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
      socket.emit('userConnected', { userId });

      const handleRideStarted = (data, driverDetails) => {
        try {
          if (!data) {
            throw new Error('Invalid data received');
          }
          setDriver(driverDetails);
          navigate("/user-dashboard/ride");
        } catch (error) {
          console.error('Error handling rideStarted event:', error);
        }
      };

      socket.on('rideStarted', handleRideStarted);
      socket.on('DriverArrived', (data) => {
        alert(data.message);
      });
      socket.on('rideCompleted', (driverId) => {
        navigate("/user-dashboard/rate");
      });

      const handleLocationUpdate = (newLocation) => {
        if (newLocation && Array.isArray(newLocation) && newLocation.length === 2) {
          setDriverLocation(newLocation);
        }
      };

      socket.on('location', handleLocationUpdate);

      return () => {
        socket.off('rideStarted', handleRideStarted);
        socket.off('location', handleLocationUpdate);
      };
    }
  }, [socket, userId, navigate]);

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
          <Route path="edit-profile" element={<ProfileUpdate />} />
          <Route path="history" element={<RideHistory />} />
          <Route path="driver-data" element={<DriverData driver={driver} />} />
          <Route path="create-dispute-user" element={<CreateDisputeUser />} />
          <Route path="rate" element={<RideCompleted driver={driver} fare={fare} distance={distance} />} />
          <Route
            path="ride"
            element={
              <>
                <RideMap
                  driverLocation={driverLocation}
                  pickup={pickupCoordinates ? [pickupCoordinates.longitude, pickupCoordinates.latitude] : null}
                  dropOff={dropOffCoordinates ? [dropOffCoordinates.longitude, dropOffCoordinates.latitude] : null}
                />
                <DriverData driver={driver} />
              </>
            }
          />
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
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    marginLeft: '250px',  // Adjust this based on sidebar width
    transition: 'margin-left 0.3s ease',
  },
};

export default UserDashboard;
