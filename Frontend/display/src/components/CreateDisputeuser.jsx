import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AlertTriangle, Send, User } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f7fafc;
`;

const FormWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  color: #2d3748;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #a8d619;
    box-shadow: 0 0 0 3px rgba(168, 214, 25, 0.3);
  }
`;

const Button = styled.button`
  background-color: #c1f11d;
  color: #1a1c18;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #a8d619;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: #e0e7c7;
    color: #8c9183;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CreateDisputeUser = () => {
  const [issueDescription, setIssueDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        jwtDecode(token);
      } catch (error) {
        setError("Invalid token. Please log in again.");
        navigate("/login");
      }
    } else {
      setError("Authentication token is missing. Please log in.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Authentication token is missing. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/disputes/dispute`,
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
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Error creating dispute:", error);
      setError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>
          <User size={24} style={{ marginRight: "0.5rem" }} />
          Create a User Dispute
        </Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="issueDescription">Issue Description</Label>
            <Textarea
              id="issueDescription"
              rows="4"
              placeholder="Describe your issue in detail..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
            />
          </FormGroup>

          <Button type="submit" disabled={isSubmitting}>
            <Send size={18} style={{ marginRight: "0.5rem" }} />
            {isSubmitting ? "Submitting..." : "Submit Dispute"}
          </Button>
          {error && (
            <ErrorMessage>
              <AlertTriangle size={18} style={{ marginRight: "0.5rem" }} />
              {error}
            </ErrorMessage>
          )}
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default CreateDisputeUser;
