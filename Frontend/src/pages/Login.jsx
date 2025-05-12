import React, { useState, useEffect } from "react";
import "../Styles/Login.css";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="text-logo">Rahgeer</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <LoginForm type="user" />
    </div>
  );
}

export default LoginPage;
