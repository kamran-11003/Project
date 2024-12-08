import React, { useState } from 'react';
import DriverSidebar from '../components/DriverSidebar';
import DriverMap from '../components/DriverMap';
import RideRequest from '../components/RideRequest';
import { Routes, Route, useNavigate } from "react-router-dom";
import DriverProfileUpdate from "../components/DriverProfileUpdate";
import EarningsSummary from "../components/EarningsSummary";
import CreateDispute from "../components/CreateDispute"; // Import CreateDispute

const UserDashboard = () => {

  return (
    <div style={styles.container}>
      <DriverSidebar/>
      <div style={styles.mainContent}>
      <Routes>
          
          <Route
            path="/"
            element={
              <>
       
        <RideRequest />
        </>}
        >

        </Route>
        <Route
            path="/driver-update"
            element={
                <DriverProfileUpdate />
            }
          />

          {/* Earnings Summary Route for Drivers */}
          <Route
            path="/earnings"
            element={
                <EarningsSummary />
            }
          />

          {/* New Create Dispute Route */}
          <Route
            path="/create-dispute"
            element={
                <CreateDispute />
            }
          />

        
        </Routes>

            
      </div>
    </div>  
  );
};

const styles = {  
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f9f9f9',
  },
  mainContent: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    
  },
};

export default UserDashboard;
