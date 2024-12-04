const express = require('express');
const router = express.Router();
const { updateDriverLocation, findNearbyDrivers } = require('../controllers/DriverController');

router.put('/driver/:id/location', updateDriverLocation);

router.get('/driver/nearby', findNearbyDrivers);

module.exports = router;
