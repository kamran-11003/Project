import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Don't forget to install jwt-decode
import styled from "styled-components"; // Import styled-components
import API_BASE_URL from '../config/api';

const ProfileUpdate = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve the JWT token and decode it to get the userId
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      setToken(token);
      setUserId(userId);

      // Fetch user profile data if token and userId are found
      axios
        .get(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => {
          setError("Failed to fetch user profile.");
        });
    } catch (err) {
      setError("Invalid token.");
    }
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Make sure token and userId are available before making the request
      if (!token || !userId) {
        setError("Unauthorized: Missing token or user ID");
        return;
      }

      // Sending updated user data to the server
      await axios.put(`${API_BASE_URL}/user/profile`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId }, // Passing userId as query parameter
      });

      setIsLoading(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setIsLoading(false);
      setError("Failed to update profile.");
    }
  };

  return (
    <ProfileUpdateContainer>
      <ProfileUpdateTitle>Update Profile</ProfileUpdateTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="firstName">First Name</FormLabel>
          <FormInput
            type="text"
            id="firstName"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="lastName">Last Name</FormLabel>
          <FormInput
            type="text"
            id="lastName"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            disabled
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <FormInput
            type="text"
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            required
            pattern="^\d{11}$"
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </SubmitButton>
      </Form>
    </ProfileUpdateContainer>
  );
};

export default ProfileUpdate;

// Styled-components

const ProfileUpdateContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileUpdateTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  background-color: #ffcccc;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const FormInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;

  &:disabled {
    background-color: #f1f1f1;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;
