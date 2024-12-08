import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { 
  FaHome, 
  FaHistory, 
  FaSignOutAlt, 
  FaUser, 
  FaBars, 
  FaTimes 
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

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

const SidebarContainer = styled.div`
  width: 250px;
  background: #f8f9fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e9ecef;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 100%;
    max-width: 300px;
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
  display: flex;
  align-items: center;
`;


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 150px);
  overflow-y: auto;
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

const EditProfileButton = styled.button`
  margin-top: 0.5rem;
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

const Sidebar = () => {
  const [user, setUser] = useState({ name: "Loading...", wallet: 0 });
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
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
    navigate("/");
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const navigationItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/user-dashboard" },
    { icon: <FaHistory />, label: "Ride History", path: "/user-dashboard/history" },
    { icon: <FaHistory />, label: "Help and Support", path: "/user-dashboard/create-dispute-user" },
  ];

  return (
    <>
      <MobileHeader>
        <HamburgerIcon onClick={toggleMobileSidebar}>
          {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </HamburgerIcon>
      </MobileHeader>

      <SidebarContainer $isOpen={isMobileSidebarOpen}>
        <ProfileSection>
          <FaUser style={{ fontSize: '2rem', marginRight: '1rem', color: '#4a5568' }} />
          <ProfileInfo>
            <Name>{user.name}</Name>
            <EditProfileButton onClick={() => navigate("/user-dashboard/edit-profile")}>
              Edit Profile
            </EditProfileButton>
          </ProfileInfo>
        </ProfileSection>

        <ContentWrapper>
          <Navigation>
            {navigationItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </Navigation>

          <LogoutLink 
            as="div" 
            onClick={() => {
              handleLogout();
              setIsMobileSidebarOpen(false);
            }}
          >
            <FaSignOutAlt />
            Logout
          </LogoutLink>
        </ContentWrapper>
      </SidebarContainer>
      <Overlay $isOpen={isMobileSidebarOpen} onClick={toggleMobileSidebar} />
    </>
  );
};

export default Sidebar;