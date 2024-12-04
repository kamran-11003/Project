require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRouts');
const bodyParser = require('body-parser');
const fareRoutes = require('./routes/fareRoutes'); 
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/DriverRoutes');
const http = require('http'); // Needed for socket.io integration
const socketIo = require('socket.io'); // Import Socket.io

// Initialize express app
const app = express();

// Create an HTTP server to integrate with Socket.io
const server = http.createServer(app);

// Initialize Socket.io with CORS support
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
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ride', rideRoutes);
app.use('/api/fare', fareRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Socket.io handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('locationUpdate', async ({ driverId, longitude, latitude }) => {
    console.log(`Received location update for driver ${driverId}:`, { longitude, latitude });

    // Update the driver's location in the database
    try {
      const Driver = require('./models/Driver'); // Import your Driver model
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

    // Broadcast the location update to other clients
    socket.broadcast.emit('driverLocationUpdate', { driverId, longitude, latitude });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
