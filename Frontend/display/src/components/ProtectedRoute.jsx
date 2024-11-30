import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    // Validate token
    jwtDecode(token);
    return children;
  } catch (err) {
    console.error('Invalid token', err);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
