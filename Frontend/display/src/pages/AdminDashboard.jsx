import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from '../components/UserManagement';
import DriverManagement from '../components/DriverManagement';
import FareManagement from '../components/FareManagement';
const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('dashboard'); // Default page

  // Function to handle sidebar link clicks
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  // Function to return the selected page content
  const renderSelectedPage = () => {
    switch (selectedPage) {
      case 'user-management':
        return <UserManagement />;
      case 'driver-management':
        return <DriverManagement />;
      case 'fare-and-discount':
        return <FareManagement />;
      default:
        return <UserManagement/>
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar onSelectPage={handlePageChange} />
      <div style={{ flex: 1, padding: '1rem' }}>
        {renderSelectedPage()}
      </div>
    </div>
  );
};

export default AdminDashboard;