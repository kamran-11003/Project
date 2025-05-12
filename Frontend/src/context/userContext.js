import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_API_URL);
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Handle user-specific logic and events
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        if (socket) {
          socket.emit('userConnected', { userId: decoded.id });
        }
      } catch (err) {
        console.error('JWT Decoding Error:', err);
      }
    }
  }, [socket]);

  return (
    <UserContext.Provider value={{ userId, socket }}>
      {children}
    </UserContext.Provider>
  );
};
