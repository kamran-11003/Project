import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Import MapboxDirections using require
const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ';

const MapComponent = ({ pickup, dropOff }) => {
  const mapContainerRef = useRef(null);
  const directionsRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [73.0551, 33.6844],
      zoom: 12,
    });

    directionsRef.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
    });

    map.addControl(directionsRef.current, 'top-left');

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (pickup && dropOff) {
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
