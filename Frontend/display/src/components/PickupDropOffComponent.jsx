import React, { useState, useEffect } from 'react';

const mapboxAccessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

const PickupDropOffComponent = ({ onSetPickupAndDropOff }) => {
  const [pickup, setPickup] = useState('');
  const [dropOff, setDropOff] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropOffSuggestions, setDropOffSuggestions] = useState([]);
  const [isPickupDropdownVisible, setPickupDropdownVisible] = useState(false);
  const [isDropOffDropdownVisible, setDropOffDropdownVisible] = useState(false);

  // Automatically trigger form submission when both fields are filled
  useEffect(() => {
    if (pickup && dropOff) {
      onSetPickupAndDropOff(pickup, dropOff);
    }
  }, [pickup, dropOff, onSetPickupAndDropOff]);

  // Handle pickup input change
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    if (value.length > 2) {
      fetchSuggestions(value, 'pickup');
      setPickupDropdownVisible(true);
    } else {
      setPickupDropdownVisible(false);
    }
  };

  // Handle drop-off input change
  const handleDropOffChange = async (e) => {
    const value = e.target.value;
    setDropOff(value);

    if (value.length > 2) {
      fetchSuggestions(value, 'dropoff');
      setDropOffDropdownVisible(true);
    } else {
      setDropOffDropdownVisible(false);
    }
  };

  // Fetch suggestions based on the query
  const fetchSuggestions = async (query, type) => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxAccessToken}`);
      const data = await response.json();
      const suggestions = data.features.map((feature) => feature.place_name);

      if (type === 'pickup') {
        setPickupSuggestions(suggestions);
      } else {
        setDropOffSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion, type) => {
    if (type === 'pickup') {
      setPickup(suggestion);
      setPickupSuggestions([]);
      setPickupDropdownVisible(false);
    } else {
      setDropOff(suggestion);
      setDropOffSuggestions([]);
      setDropOffDropdownVisible(false);
    }
  };

  return (
    <form style={styles.form}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter pickup location"
          value={pickup}
          onChange={handlePickupChange}
          style={styles.input}
        />
        {isPickupDropdownVisible && pickupSuggestions.length > 0 && (
          <div style={styles.suggestionsContainer}>
            {pickupSuggestions.map((suggestion, index) => (
              <div
                key={index}
                style={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion, 'pickup')}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter drop-off location"
          value={dropOff}
          onChange={handleDropOffChange}
          style={styles.input}
        />
        {isDropOffDropdownVisible && dropOffSuggestions.length > 0 && (
          <div style={styles.suggestionsContainer}>
            {dropOffSuggestions.map((suggestion, index) => (
              <div
                key={index}
                style={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion, 'dropoff')}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: '1',
    borderRadius: '5px',
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
  },
};

export default PickupDropOffComponent;
