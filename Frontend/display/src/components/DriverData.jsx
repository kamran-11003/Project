import React from 'react';

const DriverData = ({ driver }) => {
  if (!driver) {
    return <p>Driver information is not available.</p>;
  }

  const { name, phone, vehicle, location } = driver;

  return (
    <div className="driver-data">
      <h3>Driver Details</h3>
      <ul>
        <li><strong>Name:</strong> {name || 'N/A'}</li>
        <li><strong>Phone:</strong> {phone || 'N/A'}</li>
        <li><strong>Vehicle:</strong> {vehicle || 'N/A'}</li>
        <li>
          <strong>Location:</strong>{' '}
          {location
            ? `Lat: ${location[1].toFixed(4)}, Lon: ${location[0].toFixed(4)}`
            : 'N/A'}
        </li>
      </ul>
    </div>
  );
};

const driver = {
  name: 'John Doe',
  phone: '123-456-7890',
  vehicle: 'Toyota Prius',
  location: [37.7749, -122.4194], // Example coordinates (longitude, latitude)
};

const App = () => {
  return (
    <div>
      <DriverData driver={driver} />
    </div>
  );
};

export default App;
