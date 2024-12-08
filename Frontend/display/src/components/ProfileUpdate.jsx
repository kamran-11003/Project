import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Don't forget to install jwt-decode

const ProfileUpdate = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
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
      axios.get('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => {
          setError('Failed to fetch user profile.');
        });
    } catch (err) {
      setError('Invalid token.');
    }
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Make sure token and userId are available before making the request
      if (!token || !userId) {
        setError('Unauthorized: Missing token or user ID');
        return;
      }

      // Sending updated user data to the server
      await axios.put('http://localhost:5000/api/user/profile', user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId }, // Passing userId as query parameter
      });

      setIsLoading(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setIsLoading(false);
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="profile-update">
      <h2>Update Profile</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            required
            pattern="^\d{11}$"
          />
        </div>


        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
