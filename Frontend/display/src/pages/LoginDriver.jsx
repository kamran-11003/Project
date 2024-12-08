import React from "react";
import "../Styles/Login.css";
import LoginForm from "../components/LoginForm";
const LoginDriver = () => {
  return (
    <div className="login-container">
      <LoginForm type="driver" />
    </div>
  );
};

export default LoginDriver;
