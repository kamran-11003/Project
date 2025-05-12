import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userType, setUserType] = useState(null); // 'user' or 'driver'
  const [userId, setUserId] = useState(null); // User or driver ID

  // Initialize socket connection
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_API_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);

      // Decode JWT and identify user type and ID
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const type = decoded.role; // Assuming the role is either 'user' or 'driver'
          setUserType(type);
          console.log()
          setUserId(decoded.id);

          // Emit identify event to server with user type and ID
          socketRef.current.emit('identify', {  type, userId: decoded.id });
        } catch (error) {
          console.error('JWT decoding failed:', error);
        }
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, userType, userId }}>
      {children}
    </SocketContext.Provider>
  );
};
