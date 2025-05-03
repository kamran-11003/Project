import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import API_BASE_URL from '../config/api';

// Rating Component
const RatingStar = ({ driverId }) => {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [newFeedback, setNewFeedback] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleRatingSubmit = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `${API_BASE_URL}/rating/rate`,
        { driverId, rating: userRating, comment: newFeedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRatingSubmitted(true);
      setNewFeedback("");
      setUserRating(0);
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `${API_BASE_URL}/feedbacks/add`,
        { driverId, feedback: newFeedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
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
            color: index < rating ? "#FFD700" : "#E0E0E0",
            cursor: "pointer",
          }}
        >
          ★
        </span>
      ));
  };

  return (
    <RatingSection>
      <h4>Submit Your Rating</h4>
      <div>{renderStars(userRating, setUserRating)}</div>
      <textarea
        placeholder="Leave feedback"
        value={newFeedback}
        onChange={(e) => setNewFeedback(e.target.value)}
        rows="3"
      />
      <SubmitButton onClick={handleRatingSubmit}>Submit</SubmitButton>
    </RatingSection>
  );
};

// Ride Completion Component
const RideCompleted = ({ driver, fare, distance }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsCompleted(true); // Simulating a completed ride for example
  }, []);

  return (
    <ReceiptContainer>
      <ReceiptHeader>
        <h1>Ride Receipt</h1>
        <p className="driver-info">Driver: {driver.name}</p>
        <p className="ride-status">
          {isCompleted ? "Ride Completed" : "Ride in Progress"}
        </p>
      </ReceiptHeader>

      <ReceiptDetails>
        <p>
          Fare: <strong>${fare}</strong>
        </p>
        <p>
          Distance: <strong>{distance} km</strong>
        </p>
      </ReceiptDetails>

      <ReceiptFooter>
        <p>Thank you for riding with us!</p>
        {isCompleted && <RatingStar driverId={driver._id} />}
      </ReceiptFooter>
    </ReceiptContainer>
  );
};

export default RideCompleted;

// Styled Components

const ReceiptContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  font-family: "Arial", sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ReceiptHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 28px;
    margin: 0;
  }

  .driver-info {
    font-size: 16px;
    color: #555;
  }

  .ride-status {
    font-size: 18px;
    font-weight: bold;
    color: #3a7f33; /* Green color for completed rides */
  }
`;

const ReceiptDetails = styled.div`
  margin-bottom: 30px;

  p {
    font-size: 18px;
    line-height: 1.6;
    margin: 10px 0;
  }

  strong {
    color: #333;
  }
`;

const ReceiptFooter = styled.div`
  text-align: center;
`;

const RatingSection = styled.div`
  margin-top: 20px;
  text-align: center;

  textarea {
    width: 90%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    font-family: "Arial", sans-serif;
  }

  textarea:focus {
    outline-color: #4caf50;
  }
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;
