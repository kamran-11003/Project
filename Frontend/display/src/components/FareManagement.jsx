// FareManagement.js
import React, { useState } from 'react';
import axios from 'axios';

const FareManagement = () => {
  const [rideType, setRideType] = useState('');
  const [fareMultiplier, setFareMultiplier] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Handle fare update
  const handleFareUpdate = () => {
    axios
      .put('http://localhost:5000/api/admin/fare/update', { rideType, fareMultiplier })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error updating fare'));
  };

  // Handle promotion add
  const handleAddPromotion = () => {
    axios
      .post('http://localhost:5000/api/admin/promotion/add', { rideType, promotionCode, discountPercentage, validUntil })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error adding promotion'));
  };

  // Handle promotion removal
  const handleRemovePromotion = () => {
    axios
      .delete('http://localhost:5000/api/admin/promotion/remove', { data: { rideType, promotionCode } })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error removing promotion'));
  };

  // Handle promotion update
  const handleUpdatePromotion = () => {
    axios
      .put('http://localhost:5000/api/admin/promotion/update', { rideType, promotionCode, discountPercentage, validUntil })
      .then((response) => alert(response.data.message))
      .catch((error) => alert('Error updating promotion'));
  };

  return (
    <div>
      <h1>Fare Management</h1>
      <div>
        <h2>Update Fare</h2>
        <input
          type="text"
          placeholder="Ride Type"
          value={rideType}
          onChange={(e) => setRideType(e.target.value)}
        />
        <input
          type="number"
          placeholder="Fare Multiplier"
          value={fareMultiplier}
          onChange={(e) => setFareMultiplier(e.target.value)}
        />
        <button onClick={handleFareUpdate}>Update Fare</button>
      </div>
      <div>
        <h2>Add Promotion</h2>
        <input
          type="text"
          placeholder="Ride Type"
          value={rideType}
          onChange={(e) => setRideType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Promotion Code"
          value={promotionCode}
          onChange={(e) => setPromotionCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Discount Percentage"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
        />
        <input
          type="date"
          placeholder="Valid Until"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
        <button onClick={handleAddPromotion}>Add Promotion</button>
      </div>
      <div>
        <h2>Remove Promotion</h2>
        <input
          type="text"
          placeholder="Ride Type"
          value={rideType}
          onChange={(e) => setRideType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Promotion Code"
          value={promotionCode}
          onChange={(e) => setPromotionCode(e.target.value)}
        />
        <button onClick={handleRemovePromotion}>Remove Promotion</button>
      </div>
      <div>
        <h2>Update Promotion</h2>
        <input
          type="text"
          placeholder="Ride Type"
          value={rideType}
          onChange={(e) => setRideType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Promotion Code"
          value={promotionCode}
          onChange={(e) => setPromotionCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Discount Percentage"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
        />
        <input
          type="date"
          placeholder="Valid Until"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
        <button onClick={handleUpdatePromotion}>Update Promotion</button>
      </div>
    </div>
  );
};

export default FareManagement;
