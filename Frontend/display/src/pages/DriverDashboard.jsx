import React from "react";
import styled from "styled-components";
import DriverSidebar from "../components/DriverSidebar";
import DriverMap from "../components/DriverMap";
import RideRequest from "../components/RideRequest";
import { Routes, Route } from "react-router-dom";
import DriverProfileUpdate from "../components/DriverProfileUpdate";
import EarningsSummary from "../components/EarningsSummary";
import CreateDispute from "../components/CreateDispute";

const DriverDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Container>
      <DriverSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <MainContent isSidebarOpen={isSidebarOpen}>
        <Routes>
          <Route
            path="/"
            element={
              <>
               
                <RideRequest />
              </>
            }
          />
          <Route path="/driver-update" element={<DriverProfileUpdate />} />
          <Route path="/earnings" element={<EarningsSummary />} />
          <Route path="/create-dispute" element={<CreateDispute />} />
          
        </Routes>
      </MainContent>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9f9f9;
  flex-direction: row;
  transition: all 0.3s ease;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  margin-left: ${(props) => (props.isSidebarOpen ? "250px" : "70px")};
  transition: margin-left 0.3s ease;

  @media (min-width: 1024px) {
    margin-left: ${(props) => (props.isSidebarOpen ? "300px" : "100px")};
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export default DriverDashboard;
