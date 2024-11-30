import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ type }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getApiEndpoint = (type) => {
    switch (type) {
      case 'admin':
        return 'https://your-api-endpoint.com/admin/login';
      case 'user':
        return 'https://your-api-endpoint.com/user/login';
      case 'driver':
        return 'https://your-api-endpoint.com/driver/login';
      default:
        throw new Error('Invalid user type');
    }
  };

  const getDashboardPath = (type) => {
    switch (type) {
      case 'admin':
        return '/admin-dashboard';
      case 'user':
        return '/user-dashboard';
      case 'driver':
        return '/driver-dashboard';
      default:
        throw new Error('Invalid user type');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const apiEndpoint = getApiEndpoint(type);
      const response = await axios.post(apiEndpoint, { email, password });

      // Assume the JWT is in response.data.token
      const { token } = response.data;

      // Store JWT in local storage (or cookies for more secure handling)
      localStorage.setItem('jwtToken', token);

      console.log(`${type} login successful`, response.data);

      // Redirect to the appropriate dashboard
      const dashboardPath = getDashboardPath(type);
      navigate(dashboardPath);
    } catch (err) {
      setError('Invalid email or password');
      console.error(`${type} login failed`, err);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Login</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
