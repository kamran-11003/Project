import React, { useState } from 'react';
import Sidebar from '../components/DriverSidebar';
import MapComponent from '../components/MapComponent';
import DriverSidebar from '../components/DriverSidebar';

const UserDashboard = () => {
  return (
    <div style={styles.container}>
      <DriverSidebar/>
      <div style={styles.mainContent}>
        <MapComponent />
        
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
