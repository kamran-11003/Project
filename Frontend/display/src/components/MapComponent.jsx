import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

const DriverMap = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Initialize the map
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [73.0551, 33.6844], // Default to Islamabad
        zoom: 12,
      });

      setMap(newMap);
      return newMap;
    };

    const mapInstance = initializeMap();

    return () => mapInstance.remove(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Fetch and display current location
    const updateCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([longitude, latitude]);

          if (map) {
            // Add a pin at the user's current location
            new mapboxgl.Marker({ color: 'red' }) // Red pin for better visibility
              .setLngLat([longitude, latitude])
              .addTo(map);

            // Center the map on the current location
            map.setCenter([longitude, latitude]);
            map.setZoom(15); // Zoom in for better focus on current location
          }
        }, 
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true }); // High accuracy for better location data
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    updateCurrentLocation();
  }, [map]);

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

export default DriverMap;
