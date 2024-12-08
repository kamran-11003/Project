import React from 'react';
import styled from 'styled-components';

const UnauthorizedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa; /* Light background similar to sidebar */
  color: #4a5568; /* Text color from sidebar */
  font-family: 'Arial', sans-serif;
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  color: #e53e3e; /* Red color for Unauthorized */
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.25rem;
  color: #2d3748;
  text-align: center;
  max-width: 500px;
`;

const Unauthorized = () => {
  return (
    <UnauthorizedContainer>
      <Heading>Unauthorized</Heading>
      <Message>You do not have permission to view this page.</Message>
    </UnauthorizedContainer>
  );
};

export default Unauthorized;

