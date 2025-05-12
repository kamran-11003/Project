import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Set up Axios defaults for global token handling
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "/api";
axios.interceptors.request.use((config) => {
  const jwtToken = localStorage.getItem("jwtToken"); // Retrieve the token from localStorage
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`; // Attach the token to the Authorization header
  }
  return config;
});

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    axios
      .get("/admin/suspended-banned-users")
      .then((response) => {
        setUsers(response.data.users); // Update the state with users data
        console.log(response); // Log the response for debugging
      })
      .catch((error) => {
        console.error(error); // Log error for debugging
        setMessage("Error fetching suspended/banned users");
      });
  }, []);

  // Handle user status update
  const handleStatusUpdate = () => {
    if (!userId || !status) {
      return setMessage("Please provide both User ID and Status");
    }
    axios
      .put("/admin/user/status", { userId, status })
      .then((response) => {
        setMessage(response.data.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  suspensionStatus: response.data.user.suspensionStatus,
                }
              : user
          )
        );
      })
      .catch((error) => setMessage("Error updating user status"));
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (!userId) {
      return setMessage("Please provide a User ID");
    }

    axios
      .delete("/admin/user/delete", { data: { userId } })
      .then((response) => {
        setMessage(response.data.message);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      })
      .catch((error) => setMessage("Error deleting user"));
  };

  return (
    <Container>
      <Title>User Management</Title>

      {message && <Message>{message}</Message>}

      <NavBar>
        <NavButton
          onClick={() => setCurrentSection(1)}
          $isActive={currentSection === 1}
        >
          Suspended or Banned Users
        </NavButton>
        <NavButton
          onClick={() => setCurrentSection(2)}
          $isActive={currentSection === 2}
        >
          Update User Status
        </NavButton>
        <NavButton
          onClick={() => setCurrentSection(3)}
          $isActive={currentSection === 3}
        >
          Delete User
        </NavButton>
      </NavBar>

      <FormContainer>
        {currentSection === 1 && (
          <Section>
            <SubTitle>Suspended or Banned Users</SubTitle>
            <UserList>
              {users.length > 0 ? (
                users.map((user) => (
                  <ListItem key={user._id}>
                    <UserDetails>
                      <strong>ID:</strong> {user._id} |{" "}
                      <strong>
                        {user.firstName} {user.lastName}
                      </strong>{" "}
                      |<strong>Email:</strong> {user.email} |
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
        )}

        {currentSection === 2 && (
          <Section>
            <SubTitle>Update User Status</SubTitle>
            <InputGroup>
              <Input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
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
              <Button onClick={handleStatusUpdate}>Update Status</Button>
            </InputGroup>
          </Section>
        )}

        {currentSection === 3 && (
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
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.6rem;
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NavButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: ${(props) => (props.$isActive ? "#C1F11D" : "#ddd")};
  color: ${(props) => (props.$isActive ? "black" : "gray")};
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
  @keyframes slideIn {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  animation: slideIn 1s ease-in-out;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
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
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    flex-direction: column;
    align-items: flex-start;
  }
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

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #c1f11d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  :hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export default UserManagement;
