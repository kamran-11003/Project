require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRouts');
const fareRoutes = require('./routes/fareRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/DriverRoutes');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ride', rideRoutes);
app.use('/api/fare', fareRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);

// Socket.io Event Handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Event to identify whether the client is a driver or user
  socket.on('identify', ({ type, userId }) => {

    console.log(`Client identified as: ${type} with ID: ${userId}`);
    socket.userType = type; // Store the type (user or driver)
    socket.userId = userId; // Store the user or driver ID
  });
 
  // Request location updates from drivers
  socket.on('requestLocationUpdate', () => {
    if (socket.userType === 'driver') {
      console.log('Requesting location update from all drivers');
      io.emit('sendLocationUpdate');
    }
  });

  // Handle location updates for drivers
  socket.on('locationUpdate', async ({ driverId, longitude, latitude }) => {
    if (socket.userType === 'driver') {
      console.log(`Received location update for driver ${driverId}:`, { longitude, latitude });

      try {
        const Driver = require('./models/Driver');
        await Driver.findByIdAndUpdate(driverId, {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        });
        console.log('Driver location updated in database.');
      } catch (error) {
        console.error('Error updating driver location:', error);
      }
    }
  });

  // Handle user ride requests (example event)
  socket.on('requestRide', async ({ userId, location }) => {
    if (socket.userType === 'user') {
      console.log(`User ${userId} is requesting a ride at location:`, location);
      // Logic for handling ride requests for users can go here
      // Emit an event to notify available drivers, etc.
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
