
// src/components/RideRequest.jsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext'; // Import the context

const RideRequest = () => {
  const { socket, userType, userId } = useSocket(); // Access socket and user info from context
  const [rideRequest, setRideRequest] = useState(null);

  useEffect(() => {
    if (userType === 'driver' && socket) {
      // Listen for the 'rideRequest' event only if the user is a driver
      socket.on('rideRequest', (data) => {
        console.log('Ride request received:', data);
        setRideRequest(data);  // Store the ride request data in the state
      });
      
      // Cleanup listener on component unmount
      return () => {
        socket.off('rideRequest'); // Unsubscribe to avoid memory leaks
      };
    }
  }, [socket, userType]); // Only run when socket or userType changes

  // Handle the "Accept Ride" button click
  const handleAcceptRide = () => {
    if (socket && rideRequest) {
      // Emit the acceptRide event to the server with ride details
      const driverid=userId;
      socket.emit('acceptRide',{rideRequest,driverid});

      console.log('Ride accepted by driver', userId, 'for ride:', rideRequest.id);
      alert('Ride accepted!');
    } else {
      console.error('Unable to accept ride. Please try again.');
    }
  };

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
          <button onClick={handleAcceptRide}>Accept Ride</button>
        </div>
      ) : (
        <p>No ride request at the moment</p>
      )}
    </div>
  );
};

export default RideRequest;