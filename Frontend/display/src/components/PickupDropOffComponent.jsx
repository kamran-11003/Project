import React, { useState } from 'react';

const PickupDropOffComponent = ({ onSetPickupAndDropOff }) => {
  const [pickup, setPickup] = useState('');
  const [dropOff, setDropOff] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickup && dropOff) {
      onSetPickupAndDropOff(pickup, dropOff);
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter pickup location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Enter drop-off location"
        value={dropOff}
        onChange={(e) => setDropOff(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Get Route</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default PickupDropOffComponent;
