import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {jwtDecode} from 'jwt-decode';

// Styled components for the Ride History page
const RideHistoryContainer = styled.div`
  padding: 1.5rem;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const RideCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RideDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-weight: bold;
  text-align: center;
`;

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('User not authenticated. Please log in.');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // Fetching ride history
        const response = await axios.get(`http://localhost:5000/api/ride/rides/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRides(response.data);
      } catch (error) {
        console.error('Error fetching ride history:', error);
        setError('No Ride Found.');
      }
    };

    fetchRideHistory();
  }, []);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <RideHistoryContainer>
      <h2>Your Ride History</h2>
      {rides.length > 0 ? (
        rides.map((ride) => (
          <RideCard key={ride._id}>
            <RideDetails>
              <Label>Status:</Label>
              <span>{ride.status}</span>
            </RideDetails>
            <RideDetails>
              <Label>Pickup:</Label>
              <span>
                Lat: {ride.pickupCoordinates.latitude}, Long: {ride.pickupCoordinates.longitude}
              </span>
            </RideDetails>
            <RideDetails>
              <Label>Drop-Off:</Label>
              <span>
                Lat: {ride.dropOffCoordinates.latitude}, Long: {ride.dropOffCoordinates.longitude}
              </span>
            </RideDetails>
            <RideDetails>
              <Label>Distance:</Label>
              <span>{ride.distance.toFixed(2)} km</span>
            </RideDetails>
            <RideDetails>
              <Label>Payment Status:</Label>
              <span>{ride.paymentStatus}</span>
            </RideDetails>
            <RideDetails>
              <Label>Created At:</Label>
              <span>{new Date(ride.createdAt).toLocaleString()}</span>
            </RideDetails>
          </RideCard>
        ))
      ) : (
        <p>No rides found.</p>
      )}
    </RideHistoryContainer>
  );
};

export default RideHistory;
