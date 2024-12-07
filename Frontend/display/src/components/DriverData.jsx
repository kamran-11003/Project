import React from 'react';

const DriverData = (driver ) => {
  if (!driver) {
    return <p>Driver information is not available.</p>;
  }
  console.log(driver);
  

  return (
    <div className="driver-data">
      <h3>Driver Details</h3>
      <ul>
        <li><strong>Name:</strong> {driver.driver.firstName || 'N/A'}</li>
        <li><strong>Phone:</strong> {driver.driver.phone || 'N/A'}</li>
        <li><strong>Vehicle:</strong> {driver.driver.vehicleMake || 'N/A'}</li>
        
      </ul>
    </div>
  );
};
export default DriverData;