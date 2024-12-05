const Driver = require('../models/Driver.js');

// Update the driver's location based on their ID
const updateDriverLocation = async (req, res) => {
  const { driverId } = req.params;
  const { longitude, latitude } = req.body;

  try {
    // Validate longitude and latitude before updating
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return res.status(400).json({ message: 'Longitude and latitude must be numbers' });
    }

    // Update the location
    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      { new: true } // Return the updated driver
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver location updated successfully', driver: updatedDriver });
  } catch (error) {
    console.error('Error updating driver location:', error.message);
    res.status(500).json({ message: 'Error updating driver location' });
  }
};

// Find nearby drivers within a specified radius
const findNearbyDrivers = async (req, res) => {
  const { longitude, latitude, radius = 10 } = req.query;

  try {
    // Validate longitude, latitude, and radius
    if (typeof longitude !== 'number' || typeof latitude !== 'number' || typeof radius !== 'number') {
      return res.status(400).json({ message: 'Longitude, latitude, and radius must be numbers' });
    }

    // Perform geospatial query to find nearby drivers
    const drivers = await Driver.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6378.1], // Convert radius to radians
        },
      },
    });

    res.status(200).json({ drivers });
  } catch (error) {
    console.error('Error finding nearby drivers:', error.message);
    res.status(500).json({ message: 'Error finding nearby drivers' });
  }
};

// Update driver details based on driver ID
const updateDriver = async (req, res) => {
  console.log(req.params)
  const { driverId } = req.params;
  const updateData = req.body;

  try {
    // Find the driver by ID and update their data
    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      updateData,
      { new: true, runValidators: true } // Return the updated driver and run validation
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver updated successfully', driver: updatedDriver });
  } catch (error) {
    console.error('Error updating driver:', error.message);
    res.status(500).json({ message: 'Error updating driver' });
  }
};

module.exports = {
  updateDriverLocation,
  findNearbyDrivers,
  updateDriver,
};
