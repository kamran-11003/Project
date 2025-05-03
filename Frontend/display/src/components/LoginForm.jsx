import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserCheck } from "lucide-react";

function LoginForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getApiEndpoint = (type) => {
    switch (type) {
      case "admin":
        return `${process.env.REACT_APP_API_URL}/api/auth/login-admin`;
      case "user":
        return `${process.env.REACT_APP_API_URL}/api/auth/login-user`;
      case "driver":
        return `${process.env.REACT_APP_API_URL}/api/auth/login-driver`;
      default:
        throw new Error("Invalid user type");
    }
  };

  const getDashboardPath = (type) => {
    switch (type) {
      case "admin":
        return "/admin-dashboard";
      case "user":
        return "/user-dashboard";
      case "driver":
        return "/driver-dashboard";
      default:
        throw new Error("Invalid user type");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const apiEndpoint = getApiEndpoint(type);
      console.log(apiEndpoint);
      const response = await axios.post(apiEndpoint, { email, password });

      // Assume the JWT is in response.data.token
      const { token } = response.data;

      // Store JWT in local storage (or cookies for more secure handling)
      localStorage.setItem("jwtToken", token);

      console.log(`${type} login successful`, response.data);

      // Redirect to the appropriate dashboard
      const dashboardPath = getDashboardPath(type);
      navigate(dashboardPath);
    } catch (err) {
      setError("Invalid email or password");
      console.error(`${type} login failed`, err);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="bg-overlay"></div>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Login Form */}
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <UserCheck size={40} className="login-icon" />
            <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Login</h1>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="form-footerlog">
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              Forgot Password?
            </Link>
            {/* Conditional render based on user type */}
            {type === "user" && (
              <a href="/register-user" className="create-account">
                Create Account
              </a>
            )}
            {type === "driver" && (
              <a href="/register-driver" className="create-account">
                Create Account
              </a>
            )}
            {/* Admin does not have a create account option */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
