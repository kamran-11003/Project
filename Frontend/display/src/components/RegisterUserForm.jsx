import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registration successful!');
      console.log('Response:', response.data);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

    {/* Registration Form */}
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-header">
          <UserPlus size={40} className="login-icon" />
          <h1>Register User</h1>
        </div>

        {message && <p className="error-message">{message}</p>}

        <div className="form-group">
          <User size={20} className="input-icon" />
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <User size={20} className="input-icon" />
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <Mail size={20} className="input-icon" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <Lock size={20} className="input-icon" />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <Phone size={20} className="input-icon" />
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="login-button" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="form-footer">
          <span>Already have an account?</span>
          <a href="/" className="create-account">Login</a>
        </div>
      </form>
    </div>
  </div>    
  );
};

export default RegisterForm;
