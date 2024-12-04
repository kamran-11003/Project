// src/components/RideRequest.jsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext'; // Import the context

const RideRequest = () => {
  const { socket, userType, userId } = useSocket(); // Access socket and user info from context
  const [rideRequest, setRideRequest] = useState(null);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);

  useEffect(() => {
    if (userType === 'driver' && socket) {
      // Listen for the 'rideRequest' event only if the user is a driver
      socket.on('rideRequest', (data) => {
        console.log('Ride request received:', data);
        if (data.nearbyDrivers) {
          setNearbyDrivers(data.nearbyDrivers);
        }
        setRideRequest(data);  // Store the ride request data in the state
      });

      // Cleanup listener on component unmount
      return () => {
        socket.off('rideRequest'); // Unsubscribe to avoid memory leaks
      };
    }
  }, [socket, userType]); // Only run when socket or userType changes

  return (
    <div>
      {rideRequest ? (
        <div>
          <h3>New Ride Request</h3>
          <p>
            User ID: {rideRequest.userId}
            <br />
            Pickup Coordinates: {JSON.stringify(rideRequest.pickupCoordinates)}
            <br />
            Distance: {rideRequest.distance} meters
          </p>

          
        </div>
      ) : (
        <p>No ride request at the moment</p>
      )}
    </div>
  );
};

export default RideRequest;
