import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { 
  FaHome, 
  FaHistory, 
  FaCog, 
  FaSignOutAlt, 
  FaUserEdit, 
  FaBars, 
  FaTimes, 
  FaUser 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import FeedbackList from './FeedbackList';
import RatingStar from './RatingStar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

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
    width: 80px;
    transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(-100%)'};
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => $isOpen ? 'flex' : 'none'};
    align-items: center;
    margin-top: 0.5rem;
  }
`;

const Name = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Email = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #718096;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
    font-size: 0.75rem;
    text-align: center;
  }
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

  @media (max-width: 768px) {
    padding: 0;
    align-items: center;
  }
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

  @media (max-width: 768px) {
    padding: 0.75rem;
    justify-content: center;

    span {
      display: none;
    }

    svg {
      margin-right: 0;
    }
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

  @media (max-width: 768px) {
    border-top: none;
    padding-top: 0.75rem;
  }
`;

const ToggleButton = styled.button`
  margin: 1rem;
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

  @media (max-width: 768px) {
    margin: 0.5rem;
    padding: 0.5rem;
    font-size: 0.8rem;
  }
`;

const FeedbackSection = styled.div`
  padding: 0 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
    padding: 0 0.5rem;
  }
`;

const DriverSidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Loading...", email: "Loading..." });
  const [isActive, setIsActive] = useState(false);
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
        const userId = decodedToken.id;

        const response = await axios.get(`http://localhost:5000/api/driver/driver/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { firstName, lastName, email, availability } = response.data.driver;
        setUser({
          name: `${firstName} ${lastName}`,
          email: email,
        });

        setIsActive(availability);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleActivation = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      await axios.put(
        `http://localhost:5000/api/driver/drivers/${userId}/toggle-availability`,
        { availability: !isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsActive((prev) => !prev);
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  const navigationItems = [
    { icon: <FaHome />, label: "Dashboard", to: "/driver-dashboard" },
    { icon: <FaUserEdit />, label: "Edit Profile", to: "/driver-dashboard/driver-update" },
    { icon: <FaCog />, label: "Earnings", to: "/driver-dashboard/earnings" },
    { icon: <FaHistory />, label: "Help and Support", to: "/driver-dashboard/create-dispute" },
  ];
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <>
      <MobileHeader>
        <HamburgerIcon onClick={toggleMobileSidebar}>
          {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </HamburgerIcon>
      </MobileHeader>

      <Overlay 
        $isOpen={isMobileSidebarOpen} 
        onClick={toggleMobileSidebar} 
      />

      <SidebarContainer $isOpen={isMobileSidebarOpen}>
        <ProfileSection>
          <FaUser style={{ fontSize: '2rem', marginRight: '1rem', color: '#4a5568' }} />
          <ProfileInfo $isOpen={isMobileSidebarOpen}>
            <Name>{user.name}</Name>
            <Email $isOpen={isMobileSidebarOpen}>{user.email}</Email>
          </ProfileInfo>
        </ProfileSection>

        <ContentWrapper>
          <Navigation>
            {navigationItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </Navigation>

          <ToggleButton active={isActive} onClick={toggleActivation}>
            {isActive ? "Active" : "Inactive"}
          </ToggleButton>

          <FeedbackSection $isOpen={isMobileSidebarOpen}>
            <FeedbackList />
            <RatingStar />
          </FeedbackSection>

          <LogoutLink onClick={() => setIsMobileSidebarOpen(false)}>
            <FaSignOutAlt />
            <span>Logout</span>
          </LogoutLink>
        </ContentWrapper>
      </SidebarContainer>
    </>
  );
};

export default DriverSidebar;