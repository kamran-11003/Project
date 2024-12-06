import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { 
  User, 
  Mail, 
  Phone, 
  Car, 
  Lock, 
  UserCheck 
} from 'lucide-react';


const DriverProfileUpdate = () => {
  const [driver, setDriver] = useState({
    firstName: '',
    lastName: '',
    email: '', 
    phone: '',
    vehicleDetails: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [driverId, setDriverId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken'); // Assuming the token is stored in localStorage
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      console.log(decoded.id);
      setDriverId(decoded.id); // Assuming the token contains the driver's ID

      // Fetch the driver details initially
      axios.get(`http://localhost:5000/api/driver/driver/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        }
      }).then((response) => {
        const driverData = response.data;
        setDriver({
          firstName: driverData.firstName,
          lastName: driverData.lastName,
          email: driverData.email,
          phone: driverData.phone,
          vehicleDetails: driverData.vehicleDetails,
          password: '', // Don't fetch the password for security reasons
        });
      }).catch(err => {
        setError('Failed to load driver data.');
      });
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:5000/api/driver/driver/${driverId}`,
        driver,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setIsLoading(false);
      alert('Profile updated successfully');
    } catch (error) {
      setIsLoading(false);
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="bg-overlay"></div>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>  

      <div className="driver-profile-wrapper">
        <div className="driver-profile-header">
          <UserCheck size={40} className="driver-profile-icon" />
          <h2>Update Driver Profile</h2>
        </div>
        
        {error && <div className="driver-error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="driver-form-group">
            <label htmlFor="firstName">
              <User size={20} className="input-icon" /> First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={driver.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="driver-form-group">
            <label htmlFor="lastName">
              <User size={20} className="input-icon" /> Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={driver.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="driver-form-group">
            <label htmlFor="email">
              <Mail size={20} className="input-icon" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={driver.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="driver-form-group">
            <label htmlFor="phone">
              <Phone size={20} className="input-icon" /> Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={driver.phone}
              onChange={handleChange}
              required
              pattern="^\d{11}$"
            />
          </div>

          <div className="driver-form-group">
            <label htmlFor="vehicleDetails">
              <Car size={20} className="input-icon" /> Vehicle Details
            </label>
            <input
              type="text"
              id="vehicleDetails"
              name="vehicleDetails"
              value={driver.vehicleDetails}
              onChange={handleChange}
              required
            />
          </div>

          <div className="driver-form-group">
            <label htmlFor="password">
              <Lock size={20} className="input-icon" /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={driver.password}
              onChange={handleChange}
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="driver-profile-submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverProfileUpdate;
