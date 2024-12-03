// UserManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [updatedUser, setUpdatedUser] = useState({});

  // Fetch suspended/banned users
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/suspended-banned-users')
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle user status update
  const handleStatusUpdate = () => {
    axios
      .put('http://localhost:5000/api/admin/user/status', { userId, status })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error updating status'));
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    axios
      .delete('http://localhost:5000/api/admin/user/delete', { data: { userId } })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error deleting user'));
  };

  return (
    <div>
      <h1>User Management</h1>
      <div>
        <h2>Suspended or Banned Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.username} - {user.suspensionStatus}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Update User Status</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <button onClick={handleStatusUpdate}>Update Status</button>
      </div>
      <div>
        <h2>Delete User</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleDeleteUser}>Delete User</button>
      </div>
    </div>
  );
};

export default UserManagement;
