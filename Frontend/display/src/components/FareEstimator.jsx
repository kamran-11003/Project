import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import { useRideContext } from '../context/rideContext'; // Import the context hook
import { useSocket } from '../context/SocketContext'; // Import the SocketContext


// Styled Components
const Container = styled.div`
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 90%;
    padding: 12px 16px;
  }
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
  flex-direction: column;
  gap: 12px;
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

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const PromoInput = styled.input`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #48bb78;
    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.2);
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const FindDriverButton = styled.button`
  padding: 12px 24px;
  background-color: #c1f11d;
  color: black;  // Button text color changed to black
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #9ccf17;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 12px;
  }
`;

// Helper function to get user ID from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('jwtToken');
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id; // Adjust based on your token's payload
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const FareEstimator = () => {
  const {
    pickup,
    dropOff,
    selectedRide,
    distance,
    fare,
    setFare,
    pickupCoordinates,
    dropOffCoordinates
  } = useRideContext();
  const { userId, socket } = useSocket(); // Get userId and socket from SocketContext

  const [fareMultipliers, setFareMultipliers] = useState({});
  const [recommendedFare, setRecommendedFare] = useState(0);
  const [customBid, setCustomBid] = useState(''); // Initialize as an empty string
  const [promoCode, setPromoCode] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  // Fetch fare multipliers from API
  useEffect(() => {
    const fetchFareData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fare/fares');
        const data = await response.json();

        const multipliers = {};
        data.forEach((item) => {
          multipliers[item.rideType] = {
            fareMultiplier: item.fareMultiplier,
            promotions: item.promotions || [],
          };
        });

        setFareMultipliers(multipliers);
      } catch (error) {
        console.error('Error fetching fare data:', error);
      }
    };

    fetchFareData();
  }, []);

  // Recalculate fare whenever selected ride or distance changes
  useEffect(() => {
    if (selectedRide && distance) {
      const rideData = fareMultipliers[selectedRide];
      if (rideData) {
        const multiplier = rideData.fareMultiplier || 20; // Default to 20 if not found
        const calculatedFare = distance * multiplier;
        setRecommendedFare(calculatedFare);
        setPromotions(rideData.promotions);
        setFare(calculatedFare - discount); // Apply discount
      }
    }
  }, [selectedRide, distance, fareMultipliers, discount]);

  const handleBidChange = (e) => {
    const bid = e.target.value;
    const minimumFare = recommendedFare - discount;

    // Allow the value to be empty or any numeric value, but show error if it's below minimum fare
    if (bid === '' || !isNaN(bid)) {
      setCustomBid(bid);
      setError(''); // Clear error message
    } else {
      setError(`Bid must be at least PKR ${minimumFare.toFixed(2)}.`);
    }
  };

  const handlePromoChange = (e) => {
    setPromoCode(e.target.value);
  };

  const applyPromoCode = () => {
    const currentPromo = promotions.find(
      (promo) =>
        promo.promotionCode === promoCode &&
        new Date(promo.validUntil) > new Date()
    );

    if (currentPromo) {
      const discountAmount =
        (recommendedFare * currentPromo.discountPercentage) / 100;
      setDiscount(discountAmount);
      setFare(recommendedFare - discountAmount);
      setError(''); // Clear any previous error
    } else {
      setError('Invalid or expired promo code.');
      setDiscount(0); // Reset discount
    }
  };

  const handleFindDriver = async () => {
    const minimumFare = recommendedFare - discount;

    if (!customBid || isNaN(customBid) || parseFloat(customBid) < minimumFare) {
      alert(`Your bid must be at least PKR ${minimumFare.toFixed(2)}.`);
      return;
    }

    const data = {
      pickup,
      dropOff,
      fare: parseFloat(customBid),
      distance,
      userId,
      pickupCoordinates,
      dropOffCoordinates
    };
    //implement socket
    socket.emit('requestRide', data);
    
  };

  return (
    <Container>
      <FareInfo>
        <FareDetails>
          <p><Label>Ride Type:</Label> {selectedRide}</p>
          <p><Label>Distance:</Label> {distance} km</p>
          <p><Label>Fare:</Label> PKR {recommendedFare.toFixed(2)}</p>
          {discount > 0 && (
            <p><Label>Discounted Fare:</Label> PKR {(recommendedFare - discount).toFixed(2)}</p>
          )}
        </FareDetails>
      </FareInfo>

      <BidSection>
        <BidInput
          type="text"  // Allow text input to make typing easier, still ensure it's numeric
          placeholder={`Minimum bid: PKR ${(recommendedFare - discount).toFixed(2)}`}
          value={customBid}
          onChange={handleBidChange}
        />
        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        <PromoInput
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={handlePromoChange}
        />
        <FindDriverButton onClick={applyPromoCode}>
          Apply Promo Code
        </FindDriverButton>
        <FindDriverButton onClick={handleFindDriver}>
          Find Driver
        </FindDriverButton>
      </BidSection>
    </Container>
  );
};

export default FareEstimator;
