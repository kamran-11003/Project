const express = require('express');
const { findDriver } = require('../controllers/rideController');

const router = express.Router();

router.post('/ride', findDriver);

module.exports = router;
