
  const findDriver = (req, res) => {
    const { pickup, dropOff, fare, distance, userId } = req.body;
  
  
    const rideDetails = {
      pickup,
      dropOff,
      fare,
      distance,
      userId,
    };
   console.log(rideDetails);
    res.status(200).json({
      message: 'Driver found!',

    });
  };
  
  module.exports = { findDriver };
  