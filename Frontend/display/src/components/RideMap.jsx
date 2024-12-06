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
  console.log(driverLocation)
  useEffect(() => {
    // Initialize the map
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: driverLocation , // Default to Islamabad if driverLocation is unavailable
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

      // Add a car marker for the driver's location once the map is ready
      newMap.on('load', () => {
        new mapboxgl.Marker({
          element: createCarMarker(), // Set custom car marker
        })
          .setLngLat(driverLocation)
          .addTo(newMap);
      });

      return newMap;
    };

    const mapInstance = initializeMap();

    return () => mapInstance.remove(); // Cleanup map instance on component unmount
  }, [driverLocation]);

  useEffect(() => {
    // Only update directions once the map is initialized
    if (pickup && dropOff && map) {
      directionsRef.current.setOrigin(driverLocation);
      directionsRef.current.setDestination(pickup);

      // Update directions with green route from driver to pickup
      map.on('load', () => {
        new mapboxgl.Marker({ color: 'green' }).setLngLat(driverLocation).addTo(map);
        new mapboxgl.Marker({ color: 'red' }).setLngLat(pickup).addTo(map);
        new mapboxgl.Marker({ color: 'blue' }).setLngLat(dropOff).addTo(map);
      });

      fetchDistance(pickup, dropOff);
    }
  }, [pickup, dropOff, map]);

  const fetchDistance = (pickupLocation, dropOffLocation) => {
    if (!pickupLocation || !dropOffLocation) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropOffLocation[0]},${dropOffLocation[1]}?access_token=${mapboxgl.accessToken}&geometries=geojson&overview=false&steps=false`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const distanceInMeters = data.routes[0].distance;
          const distanceInKm = (distanceInMeters / 1000).toFixed(2);
          setDistance(distanceInKm); // Update distance in context
        } else {
          console.error('No route found');
        }
      })
      .catch((error) => console.error('Error fetching distance:', error));
  };

  // Function to create a car marker element
  const createCarMarker = () => {
    const carMarker = document.createElement('div');
    carMarker.style.backgroundImage = 'url(/path/to/car-icon.png)'; // Update with your car image URL or use a Mapbox icon
    carMarker.style.backgroundSize = 'contain';
    carMarker.style.width = '40px';
    carMarker.style.height = '40px';
    return carMarker;
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
