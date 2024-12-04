import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRideContext } from '../context/rideContext'; // Import context

const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

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

  const { setDistance, setPickupCoordinates, setDropOffCoordinates } = useRideContext();

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [73.0551, 33.6844], // Default to Islamabad
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
        interactive: false,
      });

      newMap.addControl(directionsRef.current, 'top-left');
      setMap(newMap);

      return newMap;
    };

    const mapInstance = initializeMap();

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (pickup && dropOff) {
      Promise.all([
        geocodeAddress(pickup),
        geocodeAddress(dropOff),
      ]).then(([pickupCoordinates, dropOffCoordinates]) => {
        if (pickupCoordinates && dropOffCoordinates) {
          directionsRef.current.setOrigin(pickupCoordinates);
          directionsRef.current.setDestination(dropOffCoordinates);

          // Set the coordinates in the context
          setPickupCoordinates({
            latitude: pickupCoordinates[1], // Latitude is the second value
            longitude: pickupCoordinates[0], // Longitude is the first value
          });
          setDropOffCoordinates({
            latitude: dropOffCoordinates[1],
            longitude: dropOffCoordinates[0],
          });

          // Fetch and set the actual distance from Mapbox Directions API
          fetchDistance(pickupCoordinates, dropOffCoordinates);
        } else {
          console.error("Error geocoding the addresses.");
        }
      });
    }
  }, [pickup, dropOff]);

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
          setDistance(distanceInKm); // Set the distance in context
          console.log(`Distance: ${distanceInKm} km`);
        } else {
          console.error("No route found");
        }
      })
      .catch(error => {
        console.error('Error fetching distance from Mapbox:', error);
      });
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

export default MapComponent;
