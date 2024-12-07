import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from '../components/UserManagement';
import DriverManagement from '../components/DriverManagement';
import FareManagement from '../components/FareManagement';
import AnalyticsChart from '../components/AnalyticsChart';
// import DisputeResolution from '../components/DisputeResolution'; // Add Dispute Resolution component

const AdminDashboard = () => {
  // State to track which page/component is selected
  const [selectedPage, setSelectedPage] = useState('dashboard'); // Default page is 'dashboard'

  // Function to handle sidebar link clicks
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  // Render the selected page content based on the current state
  const renderSelectedPage = () => {
    switch (selectedPage) {
      case 'user-management':
        return <UserManagement />;
      case 'driver-management':
        return <DriverManagement />;
      case 'fare-and-discount':
        return <FareManagement />;
       case 'ride-analytics':
         return <AnalyticsChart/>;
      // case 'dispute-resolution':
      //   return <DisputeResolution />;
      default:
        return <div>Welcome to the Admin Dashboard</div>; // Default landing page
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar on the left */}
      <AdminSidebar onSelectPage={handlePageChange} />
      
      {/* Main content area */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {renderSelectedPage()}  {/* Dynamically render content */}
      </div>
    </div>
  );
};

export default AdminDashboard;
