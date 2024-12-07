import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Set up Axios defaults for global token handling
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.interceptors.request.use((config) => {
  const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`; // Attach the token to the Authorization header
  }
  return config;
});

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get('/admin/suspended-banned-users')
      .then((response) => {
        setUsers(response.data.users); // Update the state with users data
        console.log(response); // Log the response for debugging
      })
      .catch((error) => {
        console.error(error); // Log error for debugging
        setMessage('Error fetching suspended/banned users');
      });
  }, []);

  // Handle user status update
  const handleStatusUpdate = () => {
    if (!userId || !status) {
      return setMessage('Please provide both User ID and Status');
    }
    console.log(userId,status)
    axios
      .put('/admin/user/status', { userId, status })
      .then((response) => {
        setMessage(response.data.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, suspensionStatus: response.data.user.suspensionStatus } : user
          )
        );
      })
      .catch((error) => setMessage('Error updating user status'));
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (!userId) {
      return setMessage('Please provide a User ID');
    }

    axios
      .delete('/admin/user/delete', { data: { userId } })
      .then((response) => {
        setMessage(response.data.message);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      })
      .catch((error) => setMessage('Error deleting user'));
  };

  return (
    <Container>
      <Title>User Management</Title>

      {message && <Message>{message}</Message>}

      <Section>
        <SubTitle>Suspended or Banned Users</SubTitle>
        <UserList>
          {users.length > 0 ? (
            users.map((user) => (
              <ListItem key={user._id}>
                <UserDetails>
                  <strong>ID:</strong> {user._id} | <strong>{user.firstName} {user.lastName}</strong> | 
                  <strong>Email:</strong> {user.email} | 
                  <strong>Phone:</strong> {user.phone} | 
                  <strong>Status:</strong> {user.suspensionStatus}
                </UserDetails>
              </ListItem>
            ))
          ) : (
            <NoUsers>No suspended or banned users found</NoUsers>
          )}
        </UserList>
      </Section>

      <Section>
        <SubTitle>Update User Status</SubTitle>
        <InputGroup>
          <Input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Select onChange={(e) => setStatus(e.target.value)} value={status}>
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </Select>
          <Button onClick={handleStatusUpdate}>Update Status</Button>
        </InputGroup>
      </Section>

      <Section>
        <SubTitle>Delete User</SubTitle>
        <InputGroup>
          <Input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button onClick={handleDeleteUser}>Delete User</Button>
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

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px;
  background-color: #f4f4f4;
  margin: 5px 0;
`;

const UserDetails = styled.div`
  font-size: 1rem;
  line-height: 1.5;
`;

const NoUsers = styled.p`
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

export default UserManagement;
