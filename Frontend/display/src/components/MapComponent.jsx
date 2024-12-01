import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Import Directions
const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

const MapComponent = ({ pickup, dropOff }) => {
  const mapContainerRef = useRef(null);
  const directionsRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [73.0551, 33.6844], // Default to Islamabad
        zoom: 12,
      });

      // Add Directions Control
      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
      });

      newMap.addControl(directionsRef.current, 'top-left');
      setMap(newMap);

      return newMap;
    };

    const mapInstance = initializeMap();

    // Cleanup function to remove the map on unmount
    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (map) {
      // Get the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Center the map to the user's current location
          map.flyTo({ center: [longitude, latitude], zoom: 14 });

          // Add a marker at the user's location
          new mapboxgl.Marker({ color: 'red' })
            .setLngLat([longitude, latitude])
            .addTo(map);
        },
        (error) => {
          console.error('Error getting current location:', error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map]);

  useEffect(() => {
    if (directionsRef.current && pickup && dropOff) {
      directionsRef.current.setOrigin(pickup);
      directionsRef.current.setDestination(dropOff);
    }
  }, [pickup, dropOff]);

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