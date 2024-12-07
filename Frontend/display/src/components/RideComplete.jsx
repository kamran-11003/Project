import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Note: Make sure to install jwt-decode library
import { useNavigate } from 'react-router-dom';
// Rating Component
const RatingStar = ({ driverId }) => {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [newFeedback, setNewFeedback] = useState('');

  // Fetch average rating and feedback
  useEffect(() => {
   
  }, [driverId]);

  // Submit a rating
  const submitRating = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post(
        `http://localhost:5000/api/rating/rate`,
        { driverId, rating: userRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.post(
        `http://localhost:5000/api/feedbacks/add`,
        { driverId,feedback:newFeedback},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Rating and feedback submitted!');
      setNewFeedback('');
      setUserRating(0);
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating.');
    }
  };

  const renderStars = (rating, setRating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          onClick={() => setRating(index + 1)}
          style={{
            color: index < rating ? '#FFD700' : '#E0E0E0',
            cursor: 'pointer',
          }}
        >
          ★
        </span>
      ));
  };

  return (
    <div>
  
      <h4>Submit Your Rating</h4>
      <div>{renderStars(userRating, setUserRating)}</div>
      <textarea
        placeholder="Leave feedback"
        value={newFeedback}
        onChange={(e) => setNewFeedback(e.target.value)}
        rows="3"
        style={{ width: '100%' }}
      />
      <button onClick={submitRating}>Submit</button>

     
    </div>
  );
};

// Ride Completion Component
const RideCompleted = ({ driver, fare, distance }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  console.log(driver)
  useEffect(() => {
    setIsCompleted(true); // Simulating a completed ride for example
  }, []);

  return (
    <div>
      <h1>{isCompleted ? 'Ride Completed' : 'Ride in Progress'}</h1>
      <h1>Pay your Driver ${fare}</h1>
      <h2>You covered: {distance} km</h2>
      {isCompleted && <RatingStar driverId={driver._id} />}
    </div>
  );
};

export default RideCompleted;
