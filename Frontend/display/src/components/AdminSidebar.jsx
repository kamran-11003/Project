import React from 'react';
import styled from 'styled-components';
import { FaHome, FaUsers, FaCar, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 250px;
  background: #f8f9fa;
  padding: 1.5rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e9ecef;
`;

const NavLink = styled.a`
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
  margin-top: auto;

  &:hover {
    background: #fff5f5;
    color: #c53030;
  }
`;

const AdminSidebar = ({ onSelectPage }) => {
  const navigationItems = [
    { icon: <FaUsers />, label: 'User Management', page: 'user-management' },
    { icon: <FaCar />, label: 'Driver Management', page: 'driver-management' },
    { icon: <FaMoneyBillWave />, label: 'Fare and Discount', page: 'fare-and-discount' },
  ];

  return (
    <SidebarContainer>
      {navigationItems.map((item) => (
        <NavLink key={item.page} onClick={() => onSelectPage(item.page)} href="#!">
          {item.icon}
          {item.label}
        </NavLink>
      ))}
      <LogoutLink href="#logout">
        <FaSignOutAlt />
        Logout
      </LogoutLink>
    </SidebarContainer>
  );
};

export default AdminSidebar;
