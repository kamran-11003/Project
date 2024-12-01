import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Car, UserPlus, CreditCard, Image, FileText } from 'lucide-react';

const DriverRegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',

    // Identity Info
    idNumber: '',
    licenseNumber: '',
    licenseImage: '',
    profileImage: '',

    // Vehicle Info
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    plateNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step !== 3) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('register');
      // Replace with your API endpoint
      const response = await fetch('http://localhost:5000/api/auth/register-driver', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('Registration successful!');
      console.log('Response:', response);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepOne = () => (
    <form onSubmit={nextStep}>
      <div className="form-group">
        <User size={20} className="input-icon" />
        <input
          type="text"
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
      >
        Next
      </button>

      <div className="form-footer">
        <span>Already have an account?</span>
        <a href="/" className="create-account">Login</a>
      </div>
    </form>
  );

  const renderStepTwo = () => (
    <form onSubmit={nextStep}>
      <div className="form-group">
        <CreditCard size={20} className="input-icon" />
        <input
          type="text"
          name="idNumber"
          placeholder="Identity Card Number"
          value={formData.idNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <FileText size={20} className="input-icon" />
        <input
          type="text"
          name="licenseNumber"
          placeholder="License Number"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
      
        <div className="file-upload-wrapper">
          <input
            type="file"
            name="licenseImage"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="file-input"
            id="licenseImage"
          />
          <span className="file-placeholder">
            {formData.licenseImage ? formData.licenseImage.name : "Upload Driver's License Photo"}
          </span>
          <Image size={20} className="input-icon" />
        </div>
      </div>

      <div className="form-group">
        
        <div className="file-upload-wrapper">
          <input
            type="file"
            name="profileImage"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="file-input"
            id="profileImage"
          />
          <span className="file-placeholder">
            {formData.profileImage ? formData.profileImage.name : "Upload Profile Photo"}
          </span>
          <User size={20} className="input-icon" />
        </div>
      </div>


      <button
        type="submit"
        className="login-button"
      >
        Next
      </button>

      <button
        type="button"
        className="login-button"
        onClick={prevStep}
        style={{ marginTop: '10px', backgroundColor: '#f0f0f0' }}
      >
        Back
      </button>
    </form>
  );

  const renderStepThree = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <Car size={20} className="input-icon" />
        <input
          type="text"
          name="vehicleMake"
          placeholder="Vehicle Make"
          value={formData.vehicleMake}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <Car size={20} className="input-icon" />
        <input
          type="text"
          name="vehicleModel"
          placeholder="Vehicle Model"
          value={formData.vehicleModel}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <Car size={20} className="input-icon" />
        <input
          type="number"
          name="vehicleYear"
          placeholder="Vehicle Year"
          value={formData.vehicleYear}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <Car size={20} className="input-icon" />
        <input
          type="text"
          name="plateNumber"
          placeholder="License Plate Number"
          value={formData.plateNumber}
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

      <button
        type="button"
        className="login-button"
        onClick={prevStep}
        style={{ marginTop: '10px', backgroundColor: '#f0f0f0' }}
      >
        Back
      </button>
    </form>
  );

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-overlay"></div>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-wrapper">
        <div className="login-form">
          <div className="form-header">
            <UserPlus size={40} className="login-icon" />
            <h1>Driver Registration</h1>
            <p>Step {step} of 3</p>
          </div>

          {message && <p className="error-message">{message}</p>}

          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
        </div>
      </div>
    </div>
  );
};

export default DriverRegisterForm;