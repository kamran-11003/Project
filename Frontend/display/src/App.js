import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import Login from "./pages/Login";
import LoginAdmin from "./pages/LoginAdmin";
import LoginDriver from "./pages/LoginDriver";
import RegisterDriver from "./pages/RegisterDriver";
import RegisterUser from "./pages/RegisterUser";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import { RideProvider } from "./context/rideContext"; // Import the RideProvider
import { SocketProvider } from "./context/SocketContext"; // Import the SocketProvider
import DriverProfileUpdate from "./components/DriverProfileUpdate";
import EarningsSummary from "./components/EarningsSummary";
import CreateDispute from "./components/CreateDispute"; // Import CreateDispute
import CreateDisputeUser from "./components/CreateDisputeuser";

function App() {
  return (
    <SocketProvider>
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
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <RideProvider>
                  <UserDashboard />
                </RideProvider>
              </ProtectedRoute>
            }
          />
 


          {/* Unauthorized route */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
