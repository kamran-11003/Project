import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import { User, Mail, Phone, Car, Lock, UserCheck } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f7fafc;
`;

const FormWrapper = styled.div`
  max-width: 400px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #edf2f7;
  border-radius: 4px;
  padding: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #c1f11d;
  color: black;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const DriverProfileUpdate = () => {
  const [driver, setDriver] = useState({
    firstName: '',
    lastName: '',
    email: '', 
    phone: '',
    vehicleDetails: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [driverId, setDriverId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      setDriverId(decoded.id);

      axios.get(`http://localhost:5000/api/driver/driver/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        }
      }).then((response) => {
        const driverData = response.data;
        setDriver({
          firstName: driverData.firstName,
          lastName: driverData.lastName,
          email: driverData.email,
          phone: driverData.phone,
          vehicleDetails: driverData.vehicleDetails,
          password: '',
        });
      }).catch(err => {
        setError('Failed to load driver data.');
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.put(
        `http://localhost:5000/api/driver/driver/${driverId}`,
        driver,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setIsLoading(false);
      alert('Profile updated successfully');
    } catch (error) {
      setIsLoading(false);
      setError('Failed to update profile.');
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>
          <UserCheck size={24} style={{ marginRight: '0.5rem' }} />
          Update Driver Profile
        </Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <User size={18} style={{ marginRight: '0.5rem', color: '#718096' }} />
            <Input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={driver.firstName}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <User size={18} style={{ marginRight: '0.5rem', color: '#718096' }} />
            <Input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={driver.lastName}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Mail size={18} style={{ marginRight: '0.5rem', color: '#718096' }} />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={driver.email}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Phone size={18} style={{ marginRight: '0.5rem', color: '#718096' }} />
            <Input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={driver.phone}
              onChange={handleChange}
              required
              pattern="^\d{11}$"
            />
          </InputWrapper>
          <InputWrapper>
            <Car size={18} style={{ marginRight: '0.5rem', color: '#718096' }} />
            <Input
              type="text"
              name="vehicleDetails"
              placeholder="Vehicle Details"
              value={driver.vehicleDetails}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Lock size={18} style={{ marginRight: '0.5rem', color: '#718096' }} />
            <Input
              type="password"
              name="password"
              placeholder="Password (leave blank to keep unchanged)"
              value={driver.password}
              onChange={handleChange}
              minLength="6"
            />
          </InputWrapper>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default DriverProfileUpdate;

