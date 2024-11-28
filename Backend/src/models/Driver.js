const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  vehicleDetails: {
    vehicleType: String,
    vehicleNumber: String,
    vehicleModel: String
  },
  profileImage: String,
  rating: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Offline'
  },
  availability: {
    type: Boolean,
    default: false
  },
  rideHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }],
  earnings: {
    type: Number,
    default: 0
  },
  walletBalance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);