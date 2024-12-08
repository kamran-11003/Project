import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

const mapboxAccessToken =
  "pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ";

const FormContainer = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  position: absolute;
  left: 1rem;
  color: #666;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 2.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #f7fafc;
    color: #4299e1;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const PickupDropOffComponent = ({ onSetPickupAndDropOff }) => {
  const [pickup, setPickup] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropOffSuggestions, setDropOffSuggestions] = useState([]);
  const [isPickupDropdownVisible, setPickupDropdownVisible] = useState(false);
  const [isDropOffDropdownVisible, setDropOffDropdownVisible] = useState(false);

  useEffect(() => {
    if (pickup && dropOff) {
      onSetPickupAndDropOff(pickup, dropOff);
    }
  }, [pickup, dropOff, onSetPickupAndDropOff]);

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);

    if (value.length > 2) {
      fetchSuggestions(value, "pickup");
      setPickupDropdownVisible(true);
    } else {
      setPickupDropdownVisible(false);
    }
  };

  const handleDropOffChange = async (e) => {
    const value = e.target.value;
    setDropOff(value);

    if (value.length > 2) {
      fetchSuggestions(value, "dropoff");
      setDropOffDropdownVisible(true);
    } else {
      setDropOffDropdownVisible(false);
    }
  };

  const fetchSuggestions = async (query, type) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxAccessToken}`
      );
      const data = await response.json();
      const suggestions = data.features.map((feature) => feature.place_name);

      if (type === "pickup") {
        setPickupSuggestions(suggestions);
      } else {
        setDropOffSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (suggestion, type) => {
    if (type === "pickup") {
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
    <FormContainer>
      <InputWrapper>
        <InputContainer>
          <Icon>
            <FaMapMarkerAlt />
          </Icon>
          <Input
            type="text"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={handlePickupChange}
          />
        </InputContainer>
        {isPickupDropdownVisible && pickupSuggestions.length > 0 && (
          <SuggestionsContainer>
            {pickupSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion, "pickup")}
              >
                <FaMapMarkerAlt />
                {suggestion}
              </SuggestionItem>
            ))}
          </SuggestionsContainer>
        )}
      </InputWrapper>

      <InputWrapper>
        <InputContainer>
          <Icon>
            <FaLocationArrow />
          </Icon>
          <Input
            type="text"
            placeholder="Enter drop-off location"
            value={dropOff}
            onChange={handleDropOffChange}
          />
        </InputContainer>
        {isDropOffDropdownVisible && dropOffSuggestions.length > 0 && (
          <SuggestionsContainer>
            {dropOffSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion, "dropoff")}
              >
                <FaLocationArrow />
                {suggestion}
              </SuggestionItem>
            ))}
          </SuggestionsContainer>
        )}
      </InputWrapper>
    </FormContainer>
  );
};

export default PickupDropOffComponent;
