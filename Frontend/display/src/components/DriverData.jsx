import React from 'react';
import styled from 'styled-components';
import { User, Phone, Car, AlertTriangle } from 'lucide-react';

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 1rem auto;
`;

const Title = styled.h3`
  color: #2d3748;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #4a5568;
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 0.5rem;
`;

const Value = styled.span`
  color: #718096;
`;

const IconWrapper = styled.span`
  margin-right: 0.75rem;
  color: #c1f11d;
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

const DriverData = ({ driver }) => {
  if (!driver) {
    return (
      <Container>
        <ErrorMessage>
          <AlertTriangle size={18} style={{ marginRight: '0.5rem' }} />
          Driver information is not available.
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Driver Details</Title>
      <List>
        <ListItem>
          <IconWrapper>
            <User size={18} />
          </IconWrapper>
          <Label>Name:</Label>
          <Value>{driver.firstName || 'N/A'}</Value>
        </ListItem>
        <ListItem>
          <IconWrapper>
            <Phone size={18} />
          </IconWrapper>
          <Label>Phone:</Label>
          <Value>{driver.phone || 'N/A'}</Value>
        </ListItem>
        <ListItem>
          <IconWrapper>
            <Car size={18} />
          </IconWrapper>
          <Label>Vehicle:</Label>
          <Value>{driver.vehicleMake || 'N/A'}</Value>
        </ListItem>
      </List>
    </Container>
  );
};

export default DriverData;

