import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";  // Import jwt-decode

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2d3748;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  color: #2d3748;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  color: #2d3748;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3182ce;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #2b6cb0;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const CreateDisputeUser = () => {
  const [issueDescription, setIssueDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
      } catch (error) {
        setError("Invalid token.");
      }
    } else {
      setError("Authentication token is missing. Please log in.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      console.log(userId);
      const response = await axios.post(
        "http://localhost:5000/api/disputes/dispute",
        {
          userId,
          issueDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Dispute created successfully!");
        navigate("/user-dashboard"); // Navigate back to the user dashboard after success
      }
    } catch (error) {
      console.error("Error creating dispute:", error);
      setError(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <Container>
      <Title>Create a Dispute</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Issue Description</Label>
          <Textarea
            rows="4"
            placeholder="Describe the issue..."
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            required
          />
        </FormGroup>

        <Button type="submit">Submit Dispute</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </Container>
  );
};

export default CreateDisputeUser;
