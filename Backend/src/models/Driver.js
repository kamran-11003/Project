const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Simple regex for phone number (you can customize it as needed)
        return /\+?[0-9]{7,15}/.test(v);
      },
      message: 'Invalid phone number format',
    },
  },

  // Identity Information
  idNumber: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  licenseImage: {
    type: String, // Store file path or URL to the image
    required: true,
  },
  profileImage: {
    type: String, // Store file path or URL to the image
    required: true,
  },

  // Vehicle Information
  vehicleMake: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehicleYear: {
    type: Number,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;