import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FARE_MULTIPLIERS = {
  'Ride AC': 30,
  'Ride Mini': 20,
  Motoride: 10,
  Horse: 15,
  Spiderman: 50,
  Superman: 100
};

const Container = styled.div`
  background: white;
  padding: 16px 24px;  // Reduced vertical padding to 16px (from 24px)
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 800px;  // Fixed width set to 800px
  margin: 0 auto;  // Centering the container
`;

const FareInfo = styled.div`
  margin-bottom: 12px;  // Reduced bottom margin to 12px
  font-size: 14px;      // Slightly smaller font size
  color: #4a5568;
`;

const FareDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;  // Reduced bottom margin to 6px
  
  p {
    flex: 1;
    margin: 0;
    font-size: 14px;  // Slightly smaller font size
  }
`;

const Label = styled.span`
  font-weight: 600;
`;

const BidSection = styled.div`
  display: flex;
  gap: 12px;  // Reduced the gap between input and button
  align-items: center;
`;

const BidInput = styled.input`
  flex: 1;
  padding: 12px;  // Reduced padding to 12px (from 16px)
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;  // Slightly smaller font size
  outline: none;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const FindDriverButton = styled.button`
  padding: 12px 24px;  // Reduced padding to 12px top/bottom, 24px left/right
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;  // Slightly smaller font size
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #3182ce;
  }
`;

const FareEstimator = ({ rideType, distance }) => {
  const [recommendedFare, setRecommendedFare] = useState(0);
  const [customBid, setCustomBid] = useState('');

  useEffect(() => {
    if (rideType && distance) {
      const multiplier = FARE_MULTIPLIERS[rideType] || 20;
      setRecommendedFare(distance * multiplier);
    }
  }, [rideType, distance]);

  const handleBidChange = (e) => {
    setCustomBid(e.target.value);
  };

  const handleFindDriver = () => {
    if (!customBid || isNaN(customBid) || customBid <= 0) {
      alert('Please enter a valid bid.');
      return;
    }
    alert(`Finding driver with your bid of PKR ${customBid}`);
  };

  return (
    <Container>
      <FareInfo>
        <FareDetails>
          <p><Label>Ride Type:</Label> {rideType}</p>
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
