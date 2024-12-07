// controllers/disputeController.js

const Dispute = require('../models/Dispute');

// Get all disputes
exports.getDisputes = (req, res) => {
  Dispute.find()
    .populate('userId', 'name')  // Assuming 'name' is the field to populate
    .populate('driverId', 'name')
    .then(disputes => {
      res.json({ disputes });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching disputes' });
    });
};
// Create a dispute
exports.createDispute = (req, res) => {
    const { driverId, issueDescription } = req.body;
    const userId = req.user._id; // Extract user ID from the JWT token (already decoded)
  
    // Check if driverId and issueDescription are provided
    if (!driverId || !issueDescription) {
      return res.status(400).json({ message: 'Driver ID and issue description are required' });
    }
  
    // Ensure that the user is either a user or a driver, depending on your business logic
    const userRole = req.user.role; // This should be set in the JWT payload
    if (userRole !== 'user' && userRole !== 'driver') {
      return res.status(403).json({ message: 'Access denied. Only users or drivers can create disputes.' });
    }
  
    // Create a new dispute document
    const dispute = new Dispute({
      userId,
      driverId,
      issueDescription,
      status: 'Pending', // Initially, the dispute is pending
    });
    console.log(dispute);
    // Save the dispute
    dispute
      .save()
      .then((newDispute) => {
        res.status(201).json({
          message: 'Dispute created successfully',
          dispute: newDispute,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Error creating dispute' });
      });
  };

// Resolve a dispute
exports.resolveDispute = (req, res) => {
  const { disputeId, resolutionMessage } = req.body;

  if (!disputeId || !resolutionMessage) {
    return res.status(400).json({ message: 'Dispute ID and resolution message are required' });
  }

  Dispute.findByIdAndUpdate(
    disputeId,
    { status: 'Resolved', resolutionMessage, updatedAt: Date.now() },
    { new: true }
  )
    .then(dispute => {
      res.json({ message: 'Dispute resolved successfully' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error resolving dispute' });
    });
};
