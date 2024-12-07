import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Rating Component
const RatingStar = ({ driverId }) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        const driverId = decoded.id; // Get the driver's ID from decoded token
        const response = await axios.get(
          `http://localhost:5000/api/rating/average-rating/${driverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [driverId]);

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index} style={{ color: index < averageRating ? '#FFD700' : '#E0E0E0' }}>
          ★
        </span>
      ));
  };

  return (
    <div>
      <h3>Rating</h3>
      <div>{renderStars()}</div>
      <p>{averageRating.toFixed(1)} / 5</p>
    </div>
  );
};

// Ride Completion Component
const RideCompleted = ({ driverId }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // You can replace this with actual logic for ride status (e.g., from a backend API)
    setIsCompleted(true); // Set the ride as completed for this example
  }, []);

  return (
    <div>
      <h2>{isCompleted ? 'Ride Completed' : 'Ride in Progress'}</h2>
      {isCompleted && <RatingStar driverId={driverId} />}
    </div>
  );
};

export default RideCompleted;
