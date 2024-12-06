require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const fetch = require('node-fetch'); // Import fetch for server-side use
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';
const Driver = require('./models/Driver'); // Driver model
const Ride = require('./models/ride');


// Import Routes
const authRoutes = require('./routes/authRoutes');
const fareRoutes = require('./routes/fareRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/DriverRoutes');  // Make sure this is the correct path to your driver routes
const earningsRoutes = require('./routes/earningsRoutes'); 
const RatingRoutes=require('./routes/ratingRouts')
const feedbackRoutes = require('./routes/feedbackRoutes'); // Import the feedback routes


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
app.use('/api/fare', fareRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);  // Register your new driver routes here
app.use('/api/earnings', earningsRoutes);
app.use('/api/rating',RatingRoutes);
app.use('/api/feedbacks', feedbackRoutes);


const fetchDistance = (pickupLocation, dropOffLocation) => {
  if (!pickupLocation || !dropOffLocation) return Promise.reject('Invalid locations');
  console.log(pickupLocation, dropOffLocation);
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropOffLocation[0]},${dropOffLocation[1]}?access_token=${MAPBOX_ACCESS_TOKEN}&geometries=geojson&overview=false&steps=false`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceInMeters = route.distance;
        const distanceInKm = distanceInMeters / 1000;
        console.log(distanceInKm);
        return distanceInKm; // Return the distance in kilometers
      } else {
        throw new Error("No route found");
      }
    })
    .catch(error => {
      throw new Error('Error fetching distance from Mapbox: ' + error.message);
    });
};

const activeDrivers = [];
const activeUsers = [];

// Socket.io Event Handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Event to identify whether the client is a driver or user
  socket.on('identify', ({ type, userId }) => {

    console.log(`Client identified as: ${type} with ID: ${userId}`);
    socket.userType = type; // Store the type (user or driver)
    socket.userId = userId; // Store the user or driver ID

    const clientInfo = { userId, socketId: socket.id };

    // Add to the respective array
    if (type === 'driver') {
      if (!activeDrivers.find((driver) => driver.userId === userId)) {
        activeDrivers.push(clientInfo);
      }
      console.log('Active drivers:', activeDrivers);
    } else if (type === 'user') {
      if (!activeUsers.find((user) => user.userId === userId)) {
        activeUsers.push(clientInfo);
      }
      console.log('Active users:', activeUsers);
    }
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
  socket.on('requestRide', async (data) => {
    io.emit('requestLocationUpdate');
    try {
      console.log(data);

      // Emit requestLocationUpdate event to all connected clients (likely drivers)
      io.emit('requestLocationUpdate');

      if (socket.userType === 'user') {
        const { pickupCoordinates } = data; // { latitude, longitude }
        const nearbyDrivers = [];
        
        // Fetch all active drivers from the array
        for (const activeDriver of activeDrivers) {
          const driver = await Driver.findById(activeDriver.userId);

          if (driver && driver.location && driver.location.coordinates) {
            const [driverLon, driverLat] = driver.location.coordinates;
            // Fetch distance from Mapbox API
            const pickupLocation = [pickupCoordinates.longitude, pickupCoordinates.latitude]; // [lon, lat]
            const driverLocation = [driverLon, driverLat]; // [lon, lat]
            try {
              const distance = await fetchDistance(pickupLocation, driverLocation);
              console.log('Distance from driver to user:', distance);

              // Add the driver to nearbyDrivers if within 5 km (1000 meters)
              if (distance <= 150) { // Assuming the distance is in meters
                nearbyDrivers.push({
                  driverId: activeDriver.userId,
                  distance,
                  location: { latitude: driverLat, longitude: driverLon },
                });

                // Emit ride request data to the nearby driver
                io.to(activeDriver.socketId).emit('rideRequest', data);
              }
            } catch (error) {
              console.error('Error fetching distance:', error.message);
            }
          }
        }

        // Emit the list of nearby drivers to the user
        console.log(`Nearby drivers for user ${data.userId}:`, nearbyDrivers);
      }
    } catch (error) {
      console.error('Error handling ride request:', error);
    }
  });

  socket.on('acceptRide', async (res) => {
    const { rideRequest, driverid } = res;
    console.log(driverid);
    const { pickup, dropOff, fare, distance, userId, pickupCoordinates, dropOffCoordinates } = rideRequest;
    const newRide = new Ride({
      userId, 
      driverid,
      pickupCoordinates,
      dropOffCoordinates,
      fare,
      distance,
      status: 'ongoing', // Set the initial status to 'requested'
      pickup, // Address of pickup
      dropOff, // Address of drop-off
    });
    await newRide.save();
    console.log(`Ride request`);  
    io.emit('rideStarted', newRide);
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
