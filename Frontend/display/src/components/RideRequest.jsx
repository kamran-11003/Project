import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

const RideRequest = () => {
  const { socket, userType, userId } = useSocket(); 
  const [rideRequest, setRideRequest] = useState(null);
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    if (userType === 'driver' && socket) {
      if (!socket.connected) {
        console.log('Socket not connected, waiting for connection...');
        socket.connect(); // Ensure socket is connected
      }

      // Listen for the 'rideRequest' event
      socket.on('rideRequest', (data) => {
        console.log('Ride request received:', data);
        setRideRequest(data);
      });

      // Listen for the 'rideStarted' event
      socket.on('rideStarted', (newRide) => {
        console.log('Ride started:', newRide);
        setRideData(newRide);
        setRideRequest(null); // Clear ride request
      });

      return () => {
        socket.off('rideRequest');
        socket.off('rideStarted');
      };
    }
  }, [socket, userType]);

  return (
    <div>
      {rideData ? (
        <div>
          <h3>Ongoing Ride</h3>
          <p>
            Ride ID: {rideData.id}
            <br />
            User ID: {rideData.userId}
            <br />
            Pickup Coordinates: {JSON.stringify(rideData.pickupCoordinates)}
            <br />
            Destination: {JSON.stringify(rideData.destinationCoordinates)}
            <br />
            Distance: {rideData.distance} meters
          </p>
          <button onClick={() => socket.emit('notifyArrival', { rideId: rideData.id, driverId: userId })}>
            Notify User of Arrival
          </button>
          <button onClick={() => {
            socket.emit('endRide', { rideId: rideData.id, driverId: userId });
            setRideData(null); // Clear ride data
          }}>
            End Ride
          </button>
        </div>
      ) : (
        rideRequest ? (
          <div>
            <h3>New Ride Request</h3>
            <p>
              User ID: {rideRequest.userId}
              <br />
              Pickup Coordinates: {JSON.stringify(rideRequest.pickupCoordinates)}
              <br />
              Distance: {rideRequest.distance} meters
            </p>
            <button onClick={() => socket.emit('acceptRide', { rideRequest, driverId: userId })}>
              Accept Ride
            </button>
          </div>
        ) : (
          <p>No ride request at the moment</p>
        )
      )}
    </div>
  );
};

export default RideRequest;
