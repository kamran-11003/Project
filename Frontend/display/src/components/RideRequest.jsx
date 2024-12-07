import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  color: #333;
`;

const Paragraph = styled.p`
  color: #555;
  line-height: 1.5;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;

  &.accept {
    background-color: #4caf50;
  }

  &.reject {
    background-color: #f44336;
  }

  &.notify {
    background-color: #2196f3;
  }

  &.end {
    background-color: #ff9800;
  }
`;

const NoRequest = styled.p`
  text-align: center;
  color: #777;
`;

const RideRequest = () => {
  const { socket, userType, userId } = useSocket(); 
  const [rideRequest, setRideRequest] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [driverId, setDriverId] =useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
        const decoded = jwtDecode(token); // Get driverId from JWT token if needed
        const driverIdFromToken = decoded.id; // Get driverId from JWT token if needed
        setDriverId(driverIdFromToken); // Set driverId
    if (userType === 'driver' && socket) {
      if (!socket.connected) {
        console.log('Socket not connected, waiting for connection...');
        socket.connect(); // Ensure socket is connected
      }

      // Listen for the 'rideRequest' event
      socket.on('rideRequest', (data) => {
        console.log('Ride request received:', data);
        setRideRequest(data);
        setRideData(null); // Clear the previous ride data
      });

      // Listen for the 'rideStarted' event
      socket.on('rideStarted', (newRide) => {
        console.log('Ride started:', newRide);
        setRideData(newRide);
        setRideRequest(null); // Clear ride request

        const locationEmitter = setInterval(() => {
          const currentLocation = JSON.parse(localStorage.getItem('driverLocation'));
          socket.emit('locationUpdate', currentLocation);
        }, 5000); // 5000 ms = 5 seconds

        // Clear the interval when the ride ends
        socket.on('rideEnded', () => {
          clearInterval(locationEmitter);
        });
      });

      return () => {
        socket.off('rideRequest');
        socket.off('rideStarted');
      };
    }
  }, [socket, userType]);

  const rejectRide = () => {
    socket.emit('rejectRide', { rideId: rideRequest.id, driverId: userId });
    setRideRequest(null); // Clear the ride request
  };

  return (
    <Container>
      {rideData ? (
        <Section>
          <Title>Ongoing Ride</Title>
          <Paragraph>
            <strong>Pickup:</strong> {rideData.pickup}
            <br />
            <strong>Dropoff:</strong> {rideData.dropOff}
            <br />
            <strong>Distance:</strong> {rideData.distance} meters
            <br />
            <strong>Fare:</strong> ${rideData.fare}
          </Paragraph>
          <Button 
            className="notify" 
            onClick={() => socket.emit('notifyArrival', { ride: rideData })}>
            Notify User of Arrival
          </Button>
          <Button 
            className="end" 
            onClick={() => {
              socket.emit('endRide', { ride: rideData, driverId: driverId });
              setRideData(null); // Clear ride data
            }}>
            End Ride
          </Button>
        </Section>
      ) : (
        rideRequest ? (
          <Section>
            <Title>New Ride Request</Title>
            <Paragraph>
              <strong>Pickup:</strong> {rideRequest.pickup}
              <br />
              <strong>Dropoff:</strong> {rideRequest.dropOff}
              <br />
              <strong>Distance:</strong> {rideRequest.distance} meters
              <br />
              <strong>Fare:</strong> ${rideRequest.fare}
            </Paragraph>
            <Button 
              className="accept" 
              onClick={() => socket.emit('acceptRide', { rideRequest, driverid: driverId })}>
              Accept Ride
            </Button>
            <Button 
              className="reject" 
              onClick={rejectRide}>
              Reject Ride
            </Button>
          </Section>
        ) : (
          <NoRequest>No ride request at the moment</NoRequest>
        )
      )}
    </Container>
  );
};

export default RideRequest;
