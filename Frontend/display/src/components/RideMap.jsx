import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRideContext } from '../context/rideContext';
const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

const RideMap = ({ driverLocation, pickup, dropOff }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const directionsRef = useRef(null);
  const { setDistance } = useRideContext();

  useEffect(() => {
    // Initialize the map
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: driverLocation || [73.0551, 33.6844], // Default to Islamabad if driverLocation is unavailable
        zoom: 12,
      });

      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        controls: {
          inputs: false,
          instructions: false,
        },
        interactive: true, // Set to true for interactive routes
      });

      newMap.addControl(directionsRef.current, 'top-left');
      setMap(newMap);

      // Add a marker for the driver's location once the map is ready
      newMap.on('load', () => {
        new mapboxgl.Marker().setLngLat(driverLocation).addTo(newMap);
      });

      return newMap;
    };

    const mapInstance = initializeMap();

    return () => mapInstance.remove(); // Cleanup map instance on component unmount
  }, [driverLocation]);

  useEffect(() => {
    // Only update directions once the map is initialized
    if (pickup && dropOff && map) {
      directionsRef.current.setOrigin(pickup);
      directionsRef.current.setDestination(dropOff);
      
      // Add markers for pickup and drop-off locations once the map is loaded
      map.on('load', () => {
        new mapboxgl.Marker().setLngLat(pickup).addTo(map);
        new mapboxgl.Marker().setLngLat(dropOff).addTo(map);
      });

      fetchDistance(pickup, dropOff);
    }
  }, [pickup, dropOff, map]);

  const fetchDistance = (pickupLocation, dropOffLocation) => {
    if (!pickupLocation || !dropOffLocation) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropOffLocation[0]},${dropOffLocation[1]}?access_token=${mapboxgl.accessToken}&geometries=geojson&overview=false&steps=false`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Directions API response:', data); // Log API response for debugging
        if (data.routes && data.routes.length > 0) {
          const distanceInMeters = data.routes[0].distance;
          const distanceInKm = (distanceInMeters / 1000).toFixed(2);
          setDistance(distanceInKm); // Update distance in context
          console.log(`Distance: ${distanceInKm} km`);
        } else {
          console.error('No route found');
        }
      })
      .catch(error => console.error('Error fetching distance:', error));
  };

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

export default RideMap;
