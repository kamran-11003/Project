import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRideContext } from '../context/rideContext'; // Import context to access setDistance

// Import Directions
const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

// Function to geocode an address to latitude and longitude
const geocodeAddress = (address) => {
  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`;

  return fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].center; // [longitude, latitude]
        return coordinates;
      } else {
        console.error("Address not found:", address);
        return null;
      }
    })
    .catch(error => {
      console.error("Geocoding error:", error);
      return null;
    });
};

const MapComponent = ({ pickup, dropOff }) => {
  const mapContainerRef = useRef(null);
  const directionsRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null); // State for current location
  const { setDistance } = useRideContext(); // Access setDistance from context

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [73.0551, 33.6844], // Default to Islamabad
        zoom: 12,
      });

      // Add Directions Control with customization to remove unwanted UI elements
      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls: {
          inputs: false, // Hide input boxes
          instructions: false, // Hide route instructions
        },
        interactive: false, // Disable interaction
      });

      newMap.addControl(directionsRef.current, 'top-left');
      setMap(newMap);

      return newMap;
    };

    const mapInstance = initializeMap();

    return () => mapInstance.remove(); // Cleanup on component unmount
  }, []);

  // Function to update route and distance
  const updateRouteAndDistance = () => {
    if (pickup && dropOff) {
      Promise.all([geocodeAddress(pickup), geocodeAddress(dropOff)]).then(([pickupCoordinates, dropOffCoordinates]) => {
        if (pickupCoordinates && dropOffCoordinates) {
          directionsRef.current.setOrigin(pickupCoordinates);
          directionsRef.current.setDestination(dropOffCoordinates);
          fetchDistance(pickupCoordinates, dropOffCoordinates);
        } else {
          console.error("Error geocoding the addresses.");
        }
      });
    }
  };

  // Function to fetch distance using Mapbox Directions API
  const fetchDistance = (pickupLocation, dropOffLocation) => {
    if (!pickupLocation || !dropOffLocation) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropOffLocation[0]},${dropOffLocation[1]}?access_token=${mapboxgl.accessToken}&geometries=geojson&overview=false&steps=false`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceInMeters = route.distance;
          const distanceInKm = distanceInMeters / 1000;
          setDistance(distanceInKm);
          console.log(`Distance: ${distanceInKm} km`);
        } else {
          console.error("No route found");
        }
      })
      .catch(error => {
        console.error('Error fetching distance from Mapbox:', error);
      });
  };

  // Function to get and update current location
  const updateCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([longitude, latitude]);

        if (map) {
          // Create a marker for the current location
          const marker = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);

          // Optionally, center the map on the current location
          map.setCenter([longitude, latitude]);
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Update route and current location every 5 seconds
  useEffect(() => {
    updateRouteAndDistance();
    const intervalId = setInterval(updateRouteAndDistance, 5000); // Refresh every 5 seconds
    const locationIntervalId = setInterval(updateCurrentLocation, 5000); // Refresh current location every 5 seconds

    return () => {
      clearInterval(intervalId); // Cleanup route and distance refresh interval
      clearInterval(locationIntervalId); // Cleanup location refresh interval
    };
  }, [pickup, dropOff, map]);

  return <div ref={mapContainerRef} style={styles.mapContainer} />;
};

const styles = {
  mapContainer: {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
};

export default MapComponent;
