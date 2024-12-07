import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from '../components/UserManagement';
import DriverManagement from '../components/DriverManagement';
import FareManagement from '../components/FareManagement';
import AnalyticsChart from '../components/AnalyticsChart';
// import DisputeResolution from '../components/DisputeResolution'; // Add Dispute Resolution component
import styled from 'styled-components';

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
        return <AnalyticsChart />;
      // case 'dispute-resolution':
      //   return <DisputeResolution />;
      default:
        return (
          <LandingPage>
            <StyledH1>Welcome to Admin Dashboard</StyledH1>
            <StyledH1>Awaiz Ali Khan </StyledH1>
          </LandingPage>
        ); // Default landing page
    }
  };

  return (
    <Container>
      {/* Sidebar on the left */}
      <SidebarContainer>
        <AdminSidebar onSelectPage={handlePageChange} />
      </SidebarContainer>

      {/* Main content area */}
      <ContentContainer>
        {renderSelectedPage()} {/* Dynamically render content */}
      </ContentContainer>
    </Container>
  );
};

export default AdminDashboard;

// Styled Components

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #2f3b52;
  color: white;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const LandingPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledH1 = styled.h1`
  font-size: 3rem; /* Make it larger */
  color: #333;
  text-align: center; /* Center the text */
  margin: 10px 0;
  animation: fadeIn 1s ease-in-out;
`;

const fadeIn = `
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export { fadeIn }; // Export fadeIn animation for reuse
