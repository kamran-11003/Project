import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useSocket } from '../context/SocketContext'; // Import the socket context
import 'mapbox-gl/dist/mapbox-gl.css';
import { jwtDecode } from 'jwt-decode';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

const DriverMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [driverId, setDriverId] = useState(null);
  const { socket, isConnected } = useSocket(); // Use the socket context

  // Decode JWT and set driver ID
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDriverId(decoded.id);
      } catch (err) {
        console.error('JWT Decoding Error:', err);
      }
    }
  }, []);

  // Listen for location update requests from server
  useEffect(() => {
    if (isConnected) {
      socket.on('sendLocationUpdate', () => {
        const storedLocation = JSON.parse(localStorage.getItem('driverLocation'));
        if (storedLocation && driverId) {
          const { latitude, longitude } = storedLocation;
          socket.emit('locationUpdate', { driverId, longitude, latitude });
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('sendLocationUpdate');
      }
    };
  }, [isConnected, driverId, socket]);

  // Update driver location
  const updateLocation = (latitude, longitude) => {
    const locationData = { latitude, longitude };
    localStorage.setItem('driverLocation', JSON.stringify(locationData));
    setCurrentLocation([longitude, latitude]);
    setLoadingLocation(false);

    if (mapRef.current) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      mapRef.current.setCenter([longitude, latitude]);
      mapRef.current.setZoom(15);
    }
  };

  // Watch geolocation changes
  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error tracking location:', error);
          setLoadingLocation(false);
          alert('Location permission denied or unavailable.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLoadingLocation(false);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [73.0551, 33.6844],
      zoom: 12,
    });

    return () => mapRef.current?.remove();
  }, []);

  return (
    <div style={styles.container}>
      <div ref={mapContainerRef} style={styles.mapContainer} />
      <button
        onClick={() => {
          if (currentLocation) {
            mapRef.current.flyTo({ center: currentLocation, zoom: 15 });
          }
        }}
        disabled={loadingLocation || !currentLocation}
        style={styles.button}
      >
        {loadingLocation ? 'Waiting for Location...' : 'Go to Current Location'}
      </button>
    </div>
  );
};

const styles = {
  container: { position: 'relative' },
  mapContainer: { width: '100%', height: '400px', borderRadius: '8px' },
  button: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
};

export default DriverMap;
