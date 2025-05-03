import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [status, setStatus] = useState("");
  const [driverId, setDriverId] = useState("");
  const [message, setMessage] = useState("");
  const [currentSection, setCurrentSection] = useState(1); // Track the current section

  // Get JWT Token from localStorage
  const getJwtToken = () => {
    return localStorage.getItem("jwtToken");
  };

  // Axios instance with JWT token
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
  });

  // Interceptor to include JWT in Authorization header
  axiosInstance.interceptors.request.use(
    (config) => {
      const jwtToken = getJwtToken();
      if (jwtToken) {
        config.headers["Authorization"] = `Bearer ${jwtToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Fetch suspended or banned drivers
  useEffect(() => {
    axiosInstance
      .get("/admin/suspended-banned-drivers")
      .then((response) => {
        const driversData = response.data.drivers;
        console.log("Driver Info:", driversData); // Log the driver info before displaying it
        setDrivers(driversData);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
        setMessage("Error fetching suspended/banned drivers");
      });
  }, [axiosInstance]);

  // Handle driver status update
  const handleDriverStatusUpdate = () => {
    if (!driverId || !status) {
      return setMessage("Please provide both Driver ID and Status");
    }

    // Optional: Validate the driverId before sending the request
    if (!/^[0-9a-fA-F]{24}$/.test(driverId)) {
      return setMessage("Invalid Driver ID");
    }

    axiosInstance
      .put("/admin/driver/status", { driverId, status })
      .then((response) => {
        setMessage(response.data.message);
        // Update the status locally
        setDrivers((prevDrivers) =>
          prevDrivers.map((driver) =>
            driver._id === driverId
              ? { ...driver, suspensionStatus: status }
              : driver
          )
        );
      })
      .catch((error) => {
        console.error(error);
        setMessage("Error updating driver status");
      });
  };

  // Handle driver approval
  const handleApproveDriver = () => {
    if (!driverId) {
      return setMessage("Please provide a Driver ID");
    }

    axiosInstance
      .put("/admin/driver/approve", { driverId })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Error approving driver");
      });
  };

  // Handle driver deletion
  const handleDeleteDriver = () => {
    if (!driverId) {
      return setMessage("Please provide a Driver ID");
    }

    axiosInstance
      .delete("/admin/driver/delete", { data: { driverId } })
      .then((response) => {
        setMessage(response.data.message);
        // Remove the driver from the local state
        setDrivers((prevDrivers) =>
          prevDrivers.filter((driver) => driver._id !== driverId)
        );
      })
      .catch((error) => {
        console.error(error);
        setMessage("Error deleting driver");
      });
  };

  return (
    <Container>
      <Title>Driver Management</Title>

      {message && <Message>{message}</Message>}

      <NavBar>
        <NavButton
          onClick={() => setCurrentSection(1)}
          isActive={currentSection === 1}
        >
          Suspended or Banned Drivers
        </NavButton>
        <NavButton
          onClick={() => setCurrentSection(2)}
          isActive={currentSection === 2}
        >
          Update Driver Status
        </NavButton>
        <NavButton
          onClick={() => setCurrentSection(3)}
          isActive={currentSection === 3}
        >
          Approve Driver
        </NavButton>
        <NavButton
          onClick={() => setCurrentSection(4)}
          isActive={currentSection === 4}
        >
          Delete Driver
        </NavButton>
      </NavBar>

      <FormContainer>
        {/* Suspended or Banned Drivers Section */}
        {currentSection === 1 && (
          <Section>
            <SubTitle>Suspended or Banned Drivers</SubTitle>
            <DriverList>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <ListItem key={driver._id}>
                    <DriverDetails>
                      <span>
                        {driver.firstName} {driver.lastName}
                      </span>{" "}
                      -<span>{driver._id}</span> -
                      <span>{driver.suspensionStatus}</span>
                    </DriverDetails>
                  </ListItem>
                ))
              ) : (
                <NoDrivers>No suspended or banned drivers found</NoDrivers>
              )}
            </DriverList>
          </Section>
        )}

        {/* Update Driver Status Section */}
        {currentSection === 2 && (
          <Section>
            <SubTitle>Update Driver Status</SubTitle>
            <InputGroup>
              <Input
                type="text"
                placeholder="Driver ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              />
              <Select
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </Select>
              <Button onClick={handleDriverStatusUpdate}>Update Status</Button>
            </InputGroup>
          </Section>
        )}

        {/* Approve Driver Section */}
        {currentSection === 3 && (
          <Section>
            <SubTitle>Approve Driver</SubTitle>
            <InputGroup>
              <Input
                type="text"
                placeholder="Driver ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              />
              <Button onClick={handleApproveDriver}>Approve Driver</Button>
            </InputGroup>
          </Section>
        )}

        {/* Delete Driver Section */}
        {currentSection === 4 && (
          <Section>
            <SubTitle>Delete Driver</SubTitle>
            <InputGroup>
              <Input
                type="text"
                placeholder="Driver ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              />
              <Button onClick={handleDeleteDriver}>Delete Driver</Button>
            </InputGroup>
          </Section>
        )}
      </FormContainer>
    </Container>
  );
};

// Styled-components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 1s ease-in-out;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Message = styled.div`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: ${(props) => (props.isActive ? "#C1F11D" : "#ddd")};
  color: ${(props) => (props.isActive ? "black" : "gray")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;

  :hover {
    background-color: #b3e2b2;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const Section = styled.section`
  margin: 20px 0;
  animation: slideIn 1s ease-in-out;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const DriverList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px;
  background-color: #f1f1f1;
  margin: 5px 0;
`;

const DriverDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NoDrivers = styled.p`
  text-align: center;
  color: gray;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 1rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #c1f11d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  :hover {
    background-color: #4b9b4b;
  }
`;

export default DriverManagement;
