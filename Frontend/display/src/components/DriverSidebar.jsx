import React, { useState } from 'react';
import styled from "styled-components";
import { FaHome, FaHistory, FaCog, FaQuestionCircle, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom"; // Assuming you're using React Router

const SidebarContainer = styled.div`
  width: 250px;
  background: #f8f9fa;
  padding: 1.5rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e9ecef;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const Email = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #718096;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 100px);
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-y: auto;
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
    background: #edf2f7;
    color: #2b6cb0;
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
  margin-top: -10px;

  &:hover {
    background: #fff5f5;
    color: #c53030;
  }
`;

const ToggleButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: ${({ active }) => (active ? "#48bb78" : "#e53e3e")};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? "#38a169" : "#c53030")};
  }
`;

const DriverSidebar = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActivation = () => {
    setIsActive((prev) => !prev);
  };

  const navigationItems = [
    { icon: <FaHome />, label: "Dashboard", to: "/dashboard" },
    { icon: <FaHistory />, label: "Ride History", to: "/history" },
    { icon: <FaCog />, label: "Settings", to: "/settings" },
    { icon: <FaQuestionCircle />, label: "Help", to: "/help" },
    { icon: <FaUserEdit />, label: "Edit Profile", to: "/driver-update" }, // New Edit Profile link
  ];

  return (
    <SidebarContainer>
      <ProfileSection>
        <ProfileImage
          src="https://via.placeholder.com/50"
          alt="Profile"
        />
        <ProfileInfo>
          <Name>John Doe</Name>
          <Email>john.doe@example.com</Email>
        </ProfileInfo>
      </ProfileSection>

      <ContentWrapper>
        <Navigation>
          {navigationItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </Navigation>
        
        <LogoutLink to="/logout">
          <FaSignOutAlt />
          Logout
        </LogoutLink>

        <ToggleButton active={isActive} onClick={toggleActivation}>
          {isActive ? "Active" : "Inactive"}
        </ToggleButton>
      </ContentWrapper>
    </SidebarContainer>
  );
};

export default DriverSidebar;
