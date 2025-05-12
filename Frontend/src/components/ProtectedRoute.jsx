import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("jwtToken");

  // Redirect to login if no token is present
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      localStorage.removeItem("jwtToken"); // Clear expired token
      return <Navigate to="/" />;
    }

    // Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(decodedToken.role)) {
      return <Navigate to="/unauthorized" />;
    }

    return children; // Render the children if the user has the correct role
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("jwtToken");
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
