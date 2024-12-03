// DriverManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [status, setStatus] = useState('');
  const [driverId, setDriverId] = useState('');

  // Fetch suspended or banned drivers
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/suspended-banned-drivers')
      .then((response) => setDrivers(response.data.drivers))
      .catch((error) => console.error('Error fetching drivers:', error));
  }, []);

  // Handle driver status update
  const handleDriverStatusUpdate = () => {
    axios
      .put('http://localhost:5000/api/admin/driver/status', { driverId, status })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error updating driver status'));
  };

  // Handle driver approval
  const handleApproveDriver = () => {
    axios
      .put('http://localhost:5000/api/admin/driver/approve', { driverId })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error approving driver'));
  };

  // Handle driver deletion
  const handleDeleteDriver = () => {
    axios
      .delete('http://localhost:5000/api/admin/driver/delete', { data: { driverId } })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error deleting driver'));
  };

  return (
    <div>
      <h1>Driver Management</h1>
      <div>
        <h2>Suspended or Banned Drivers</h2>
        <ul>
          {drivers.map((driver) => (
            <li key={driver._id}>
              {driver.username} - {driver.suspensionStatus}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Update Driver Status</h2>
        <input
          type="text"
          placeholder="Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        />
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <button onClick={handleDriverStatusUpdate}>Update Status</button>
      </div>
      <div>
        <h2>Approve Driver</h2>
        <input
          type="text"
          placeholder="Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        />
        <button onClick={handleApproveDriver}>Approve Driver</button>
      </div>
      <div>
        <h2>Delete Driver</h2>
        <input
          type="text"
          placeholder="Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        />
        <button onClick={handleDeleteDriver}>Delete Driver</button>
      </div>
    </div>
  );
};

export default DriverManagement;
