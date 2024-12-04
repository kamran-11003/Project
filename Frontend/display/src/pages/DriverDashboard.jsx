import React, { useState } from 'react';
import DriverSidebar from '../components/DriverSidebar';
import DriverMap from '../components/DriverMap';
import RideRequest from '../components/RideRequest';
const UserDashboard = () => {

  return (
    <div style={styles.container}>
      <DriverSidebar/>
      <div style={styles.mainContent}>
        <DriverMap />
        <RideRequest />
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
