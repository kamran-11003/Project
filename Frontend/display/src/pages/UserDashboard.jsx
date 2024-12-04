import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext'; // Import the socket context
import DriverSidebar from '../components/DriverSidebar';
import DriverMap from '../components/DriverMap';
import { jwtDecode } from 'jwt-decode';

const UserDashboard = () => {
  const { socket, isConnected } = useSocket(); // Use the socket context
  const [userId, setUserId] = useState(null);
  const [location, setLocation] = useState(null);

  // Decode JWT to get user ID
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error('JWT Decoding Error:', err);
      }
    }
  }, []);

  // Listen for ride updates or location-related events specific to the user
  useEffect(() => {
    if (isConnected && userId) {
      socket.on('rideStatusUpdate', (rideData) => {
        console.log('Received ride status update:', rideData);
        // Handle the ride status update for the user here
      });

      // Example: If the user is requesting a driver update
      socket.on('driverLocationUpdate', (driverLocation) => {
        console.log('Received driver location update:', driverLocation);
        // Handle driver location update for the user
        setLocation(driverLocation);
      });
    }

    return () => {
      if (socket) {
        socket.off('rideStatusUpdate');
        socket.off('driverLocationUpdate');
      }
    };
  }, [isConnected, userId, socket]);

  const requestRide = () => {
    if (socket && userId) {
      // Emit a ride request event for the user
      socket.emit('requestRide', { userId, location });
    }
  };

  return (
    <div style={styles.container}>
      <DriverSidebar />
      <div style={styles.mainContent}>
        <DriverMap />
        <button onClick={requestRide} style={styles.button}>Request Ride</button>
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
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
};

export default UserDashboard;
