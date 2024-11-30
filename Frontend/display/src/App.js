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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-driver" element={<LoginDriver />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/register-user" element={<RegisterUser />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-dashboard"
          element={
            <ProtectedRoute role="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
