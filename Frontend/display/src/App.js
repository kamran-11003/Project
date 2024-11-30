import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';
import LoginDriver from './pages/LoginDriver';
import RegisterDriver from './pages/RegisterDriver';
import RegisterUser from './pages/RegisterUser';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-driver" element={<LoginDriver />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
