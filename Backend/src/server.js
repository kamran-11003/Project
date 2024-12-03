require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRouts');
const bodyParser = require('body-parser');
const fareRoutes = require('./routes/fareRoutes'); // Adjust path to your routes
const userRoutes = require('./routes/userRoutes'); // Adjust path to your routes
const adminRouts = require('./routes/adminRoutes'); // Adjust path to

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json()); // For parsing application/json


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ride', rideRoutes); // Include the ride routes
app.use('/api/fare', fareRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRouts); // Include the admin routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});