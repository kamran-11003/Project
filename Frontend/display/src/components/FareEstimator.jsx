import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {jwtDecode} from 'jwt-decode';
import { useRideContext } from '../context/rideContext'; // Import the context hook

// Constants
const FARE_MULTIPLIERS = {
  'Ride AC': 30,
  'Ride Mini': 20,
  Motoride: 10,
  Horse: 15,
  Spiderman: 50,
  Superman: 100,
};

// Styled Components
const Container = styled.div`
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 800px;
  margin: 0 auto;
`;

const FareInfo = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  color: #4a5568;
`;

const FareDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

  p {
    flex: 1;
    margin: 0;
    font-size: 14px;
  }
`;

const Label = styled.span`
  font-weight: 600;
`;

const BidSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const BidInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const FindDriverButton = styled.button`
  padding: 12px 24px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3182ce;
  }
`;

// Helper function to get user ID from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('jwtToken');
  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    return decodedToken.id; // Adjust based on your token's payload
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// FareEstimator Component
const FareEstimator = () => {
  const {
    pickup,
    dropOff,
    selectedRide,
    setPickup,
    setDropOff,
    setSelectedRide,
    distance,
    fare,
    setFare
  } = useRideContext(); 
  const [recommendedFare, setRecommendedFare] = useState(0);
  const [customBid, setCustomBid] = useState('');

  useEffect(() => {
    if (selectedRide && distance) {
      const multiplier = FARE_MULTIPLIERS[selectedRide] || 20;
      setRecommendedFare(distance * multiplier);
      setFare(recommendedFare); // Update the fare in the context hook for other components to see
    }
  }, [selectedRide, distance]);

  const handleBidChange = (e) => {
    setCustomBid(e.target.value);
  };

  const handleFindDriver = async () => {
    if (!customBid || isNaN(customBid) || customBid <= 0) {
      alert('Please enter a valid bid.');
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      alert('User not authenticated. Please log in.');
      return;
    }
    console.log(dropOff);
    const data = {
      pickup,
      dropOff,
      fare: parseFloat(customBid),
      distance,
      userId,
    };

    try {
      const response = await fetch('http://localhost:5000/api/ride/ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to the server.');
      }

      const result = await response.json();
      alert(`Driver found! Details: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while finding a driver. Please try again.');
    }
  };

  return (
    <Container>
      <FareInfo>
        <FareDetails>
          <p><Label>Ride Type:</Label> {selectedRide}</p>
          <p><Label>Distance:</Label> {distance} km</p>
          <p><Label>Fare:</Label> PKR {recommendedFare.toFixed(2)}</p>
        </FareDetails>
      </FareInfo>

      <BidSection>
        <BidInput
          type="number"
          placeholder="Enter your bid (PKR)"
          value={customBid}
          onChange={handleBidChange}
        />
        <FindDriverButton onClick={handleFindDriver}>
          Find Driver
        </FindDriverButton>
      </BidSection>
    </Container>
  );
};

export default FareEstimator;
