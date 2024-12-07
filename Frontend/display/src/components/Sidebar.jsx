import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Correct import
import { FaHome, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

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
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const ProfileImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  text-align: center;
`;

const WalletBalance = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #4a5568;
`;

const EditProfileButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #2b6cb0;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #2c5282;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 150px);
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

const LogoutLink = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #e53e3e;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #fff5f5;
    color: #c53030;
  }

  svg {
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }
`;

const Sidebar = () => {
  const [user, setUser] = useState({ name: "Loading...", wallet: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Assuming token contains `userId`
        const response = await axios.get(`http://localhost:5000/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser({
          name: `${response.data.firstName} ${response.data.lastName}`,
          wallet: response.data.wallet,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/"); // Redirect to login
  };

  const navigationItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/user-dashboard" },
    { icon: <FaHistory />, label: "Ride History", path: "/user-dashboard/history" },
    { icon: <FaHistory />, label: "Help and Support", path: "/user-dashboard/create-dispute-user" },
  ];

  return (
    <SidebarContainer>
      <ProfileSection>
        <ProfileImage src="https://via.placeholder.com/64" alt="Profile" />
        <ProfileInfo>
          <Name>{user.name}</Name>
          <WalletBalance>Wallet: ${user.wallet}</WalletBalance>
          <EditProfileButton onClick={() => navigate("/user-dashboard/edit-profile")}>
  Edit Profile
</EditProfileButton>
        </ProfileInfo>
      </ProfileSection>

      <ContentWrapper>
        <Navigation>
          {navigationItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </Navigation>

        <LogoutLink onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutLink>
      </ContentWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
