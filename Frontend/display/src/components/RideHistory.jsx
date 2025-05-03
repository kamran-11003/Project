import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";

// Styled components for the Ride History page
const RideHistoryContainer = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Heading = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 500;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const RideCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const RideDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1rem;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 0.5rem;
`;

const Value = styled.span`
  font-size: 14px;
  color: #555;
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-weight: 600;
  text-align: center;
  font-size: 18px;
  margin-top: 2rem;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const NoRidesMessage = styled.p`
  color: #777;
  font-size: 16px;
  text-align: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User not authenticated. Please log in.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // Fetching ride history
        const response = await axios.get(
          `http://localhost:5000/api/ride/rides/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRides(response.data);
      } catch (error) {
        console.error("Error fetching ride history:", error);
        setError("No Ride Found.");
      }
    };

    fetchRideHistory();
  }, []);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <RideHistoryContainer>
      <Heading>Your Ride History</Heading>
      {rides.length > 0 ? (
        rides.map((ride) => (
          <RideCard key={ride._id}>
            <RideDetails>
              <Label>Status:</Label>
              <Value>{ride.status}</Value>
            </RideDetails>
            <RideDetails>
              <Label>Pickup:</Label>
              <Value>
                Lat: {ride.pickupCoordinates.latitude}, Long:{" "}
                {ride.pickupCoordinates.longitude}
              </Value>
            </RideDetails>
            <RideDetails>
              <Label>Drop-Off:</Label>
              <Value>
                Lat: {ride.dropOffCoordinates.latitude}, Long:{" "}
                {ride.dropOffCoordinates.longitude}
              </Value>
            </RideDetails>
            <RideDetails>
              <Label>Distance:</Label>
              <Value>{ride.distance.toFixed(2)} km</Value>
            </RideDetails>
            <RideDetails>
              <Label>Payment Status:</Label>
              <Value>{ride.paymentStatus}</Value>
            </RideDetails>
            <RideDetails>
              <Label>Created At:</Label>
              <Value>{new Date(ride.createdAt).toLocaleString()}</Value>
            </RideDetails>
          </RideCard>
        ))
      ) : (
        <NoRidesMessage>No rides found.</NoRidesMessage>
      )}
    </RideHistoryContainer>
  );
};

export default RideHistory;
