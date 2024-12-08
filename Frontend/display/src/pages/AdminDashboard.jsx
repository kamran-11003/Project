import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import UserManagement from '../components/UserManagement';
import DriverManagement from '../components/DriverManagement';
import FareManagement from '../components/FareManagement';
import AnalyticsChart from '../components/AnalyticsChart';
import DisputeManagement from '../components/DisputeManagement';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing hamburger icon and close icon from react-icons

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Ref for sidebar to check clicks outside
  const sidebarRef = useRef();

  // Handle page change
  const handlePageChange = (page) => {
    setSelectedPage(page);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false); // Collapse sidebar on mobile after page change
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Automatically collapse sidebar on screen resize to smaller size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false); // Collapse sidebar on mobile
      } else {
        setIsSidebarOpen(true); // Keep sidebar open on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to handle first load

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close the sidebar if clicked outside
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false); // Collapse sidebar on click outside for mobile
      }
    }
  };

  // Add event listener for clicks outside the sidebar
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      case 'dispute-resolution':
        return <DisputeManagement />;
      default:
        return (
          <LandingPage>
            <StyledH1>Welcome to Admin Dashboard</StyledH1>
            <StyledH1>Awaiz Ali Khan</StyledH1>
          </LandingPage>
        );
    }
  };

  return (
    <Container>
      {/* Sidebar on the left */}
      <SidebarContainer ref={sidebarRef} isOpen={isSidebarOpen}>
        <AdminSidebar isOpen={isSidebarOpen} onSelectPage={handlePageChange} />
      </SidebarContainer>

      {/* Main content area */}
      <ContentContainer isSidebarOpen={isSidebarOpen}>
        <MobileHeader>
          <HamburgerIcon onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />} {/* Switch between hamburger and close icon */}
          </HamburgerIcon>
        </MobileHeader>
        {renderSelectedPage()}
      </ContentContainer>
    </Container>
  );
};

export default AdminDashboard;

// Styled Components

const Container = styled.div`
  display: flex;
  height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarContainer = styled.div`
  width: 250px; /* Sidebar width */
  background-color: #2f3b52;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 999;
  transition: width 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: ${({ isOpen }) => (isOpen ? '250px' : '0')}; /* Toggleable on mobile */
    overflow-x: hidden;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '250px' : '0')}; /* Adjust the margin on desktop */
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 0; /* No margin for mobile */
    padding-top: 3rem;
  }
`;

const LandingPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledH1 = styled.h1`
  font-size: 3rem;
  color: #333;
  text-align: center;
  margin: 10px 0;
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1001;
  }
`;

const HamburgerIcon = styled.div`
  cursor: pointer;
  font-size: 2rem;
  padding: 0 1rem;
  color: #333;

  @media (min-width: 769px) {
    display: none;
  }
`;
