import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCar,
  FaMoneyBillWave,
  FaChartBar,
  FaExclamationCircle,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes
} from 'react-icons/fa';

// Sidebar overlay background
const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

// Sidebar container
const SidebarContainer = styled.div`
  width: 300px;
  background: #f8f9fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease-in-out;

  @media (min-width: 769px) {
    transform: translateX(0);
  }
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
  }
`;

// Mobile hamburger menu positioned vertically
const HamburgerIcon = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    cursor: pointer;
    font-size: 1.5rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #4a5568;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  font-weight: 500;

  &:hover {
    background: #c1f11d;
    color: #000000;
    transform: translateX(4px);
  }

  svg {
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }
`;

const LogoutLink = styled(NavLink)`
  color: #e53e3e;
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #fff5f5;
    color: #c53030;
  }
`;

const AdminSidebar = ({ onSelectPage, onLogout }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigationItems = [
    { icon: <FaHome />, label: 'Dashboard', page: 'dashboard' },
    { icon: <FaUsers />, label: 'User Management', page: 'user-management' },
    { icon: <FaCar />, label: 'Driver Management', page: 'driver-management' },
    { icon: <FaMoneyBillWave />, label: 'Fare and Discount', page: 'fare-and-discount' },
    { icon: <FaChartBar />, label: 'Ride Analytics', page: 'ride-analytics' },
    { icon: <FaExclamationCircle />, label: 'Dispute Resolution', page: 'dispute-resolution' },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handlePageSelect = (page) => {
    onSelectPage(page);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
   <MobileHeader>
        <HamburgerIcon onClick={toggleMobileSidebar}>
          {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </HamburgerIcon>
      </MobileHeader>
      {/* Sidebar */}
      <SidebarContainer $isOpen={isMobileSidebarOpen}>
        <ProfileSection>
          <FaUser style={{ fontSize: '2rem', marginRight: '1rem', color: '#4a5568' }} />
          <ProfileInfo>
            <Name>Admin</Name>
          </ProfileInfo>
        </ProfileSection>
        <Navigation>
          {navigationItems.map((item) => (
            <NavLink 
              key={item.page} 
              onClick={() => handlePageSelect(item.page)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </Navigation>
        <LogoutLink 
          onClick={() => {
            onLogout();
          }}
        >
          <FaSignOutAlt />
          Logout
        </LogoutLink>
      </SidebarContainer>
     
    </>
  );
};

export default AdminSidebar;
