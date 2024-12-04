const Driver = require('../models/Driver.js');

const updateDriverLocation = async (driverId, longitude, latitude) => {
    try {
      await Driver.findByIdAndUpdate(driverId, {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      });
      console.log('Driver location updated successfully.');
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  const findNearbyDrivers = async (longitude, latitude) => {
    try {
      const drivers = await Driver.find({
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], 10 / 6378.1], // 10 km radius
          },
        },
      });
      console.log('Nearby Drivers:', drivers);
    } catch (error) {
      console.error('Error finding nearby drivers:', error);
    }
  };
module.exports ={
    updateDriverLocation,
    findNearbyDrivers,
  };
