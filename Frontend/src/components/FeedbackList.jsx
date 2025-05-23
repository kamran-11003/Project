import React, { useEffect, useState } from "react";
import styled from "styled-components";
import RatingStar from "./RatingStar"; // Assuming this component is for showing ratings
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FeedbackItem = styled.div`
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background: #f9f9f9;
`;

const CustomerName = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: #2d3748;
`;

const Comment = styled.p`
  margin: 0.5rem 0 0;
  color: #718096;
`;

const DateStyled = styled.p`
  font-size: 0.75rem;
  color: #a0aec0;
`;

const FeedbackList = ({ driverId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const decoded = jwtDecode(token);
        const driverIdFromToken = decoded.id; // Get driverId from JWT token if needed
        const driverId = driverIdFromToken;
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/feedbacks/feedbacks/${driverId}`
        );
        console.log(response);
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError("Failed to load feedbacks.");
      }
    };

    fetchFeedbacks();
  }, [driverId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (feedbacks.length === 0) {
    return <p>No feedback available for this driver.</p>;
  }

  return (
    <FeedbackContainer>
      <h3>Feedback</h3>
      {feedbacks.map((feedback) => (
        <FeedbackItem key={feedback._id}>
          <CustomerName>Customer</CustomerName>{" "}
          {/* Replace with actual customer name if available */}
          <Comment>{feedback.feedback}</Comment>
          <DateStyled>
            {new Date(feedback.date).toLocaleDateString()}
          </DateStyled>
        </FeedbackItem>
      ))}
    </FeedbackContainer>
  );
};

export default FeedbackList;
