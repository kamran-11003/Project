import React from "react";
import "../Styles/Login.css";
import LoginForm from "../components/LoginForm";
const LoginAdmin = () => {
  return (
    <div className="login-container">
      <LoginForm type="admin" />
    </div>
  );
};

export default LoginAdmin;
