import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [status, setStatus] = useState('');
  const [driverId, setDriverId] = useState('');
  const [message, setMessage] = useState('');

  // Get JWT Token from localStorage
  const getJwtToken = () => {
    return localStorage.getItem('jwtToken');
  };

  // Axios instance with JWT token
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  // Interceptor to include JWT in Authorization header
  axiosInstance.interceptors.request.use(
    (config) => {
      const jwtToken = getJwtToken();
      if (jwtToken) {
        config.headers['Authorization'] = `Bearer ${jwtToken}`;
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
      .get('/admin/suspended-banned-drivers')
      .then((response) => {
        const driversData = response.data.drivers;
        console.log('Driver Info:', driversData); // Log the driver info before displaying it
        setDrivers(driversData);
      })
      .catch((error) => {
        console.error('Error fetching drivers:', error);
        setMessage('Error fetching suspended/banned drivers');
      });
  }, []);

  // Handle driver status update
  const handleDriverStatusUpdate = () => {
    if (!driverId || !status) {
      return setMessage('Please provide both Driver ID and Status');
    }

    // Optional: Validate the driverId before sending the request
    if (!/^[0-9a-fA-F]{24}$/.test(driverId)) {
      return setMessage('Invalid Driver ID');
    }

    axiosInstance
      .put('/admin/driver/status', { driverId, status })
      .then((response) => {
        setMessage(response.data.message);
        // Update the status locally
        setDrivers((prevDrivers) =>
          prevDrivers.map((driver) =>
            driver._id === driverId ? { ...driver, suspensionStatus: status } : driver
          )
        );
      })
      .catch((error) => {
        console.error(error);
        setMessage('Error updating driver status');
      });
  };

  // Handle driver approval
  const handleApproveDriver = () => {
    if (!driverId) {
      return setMessage('Please provide a Driver ID');
    }

    axiosInstance
      .put('/admin/driver/approve', { driverId })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Error approving driver');
      });
  };

  // Handle driver deletion
  const handleDeleteDriver = () => {
    if (!driverId) {
      return setMessage('Please provide a Driver ID');
    }

    axiosInstance
      .delete('/admin/driver/delete', { data: { driverId } })
      .then((response) => {
        setMessage(response.data.message);
        // Remove the driver from the local state
        setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver._id !== driverId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('Error deleting driver');
      });
  };

  return (
    <Container>
      <Title>Driver Management</Title>

      {message && <Message>{message}</Message>}

      <Section>
        <SubTitle>Suspended or Banned Drivers</SubTitle>
        <DriverList>
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <ListItem key={driver._id}>
                <DriverDetails>
                  <span>{driver.firstName} {driver.lastName}</span> - 
                  <span>{driver._id}</span> - 
                  <span>{driver.suspensionStatus}</span>
                </DriverDetails>
              </ListItem>
            ))
          ) : (
            <NoDrivers>No suspended or banned drivers found</NoDrivers>
          )}
        </DriverList>
      </Section>

      <Section>
        <SubTitle>Update Driver Status</SubTitle>
        <InputGroup>
          <Input
            type="text"
            placeholder="Driver ID"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          />
          <Select onChange={(e) => setStatus(e.target.value)} value={status}>
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </Select>
          <Button onClick={handleDriverStatusUpdate}>Update Status</Button>
        </InputGroup>
      </Section>

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
    </Container>
  );
};

// Styled-components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Message = styled.div`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
`;

const Section = styled.section`
  margin: 20px 0;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const DriverList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px;
  background-color: #f4f4f4;
  margin: 5px 0;
`;

const DriverDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  line-height: 1.5;
`;

const NoDrivers = styled.p`
  font-size: 1rem;
  color: #666;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  :hover {
    background-color: #0056b3;
  }
`;

export default DriverManagement;
