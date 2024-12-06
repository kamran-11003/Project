import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const RatingStar = ({ driverId }) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const decoded = jwtDecode(token);
        const driverId=decoded.id;
        console.log(driverId);
        const response = await axios.get(
          `http://localhost:5000/api/rating/average-rating/${driverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error("Error fetching rating:", error);
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

export default RatingStar;
