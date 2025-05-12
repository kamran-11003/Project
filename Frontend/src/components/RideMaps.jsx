import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

const MapboxDirections = require("@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions");

mapboxgl.accessToken =
"pk.eyJ1IjoiYWJkdWxoYW5hbmNoIiwiYSI6ImNtYTg0bjFwaTE1eTAybXNpbnN4ZjhtdDkifQ.OTr8OcuHq7i2ihESOqDMwg";

const RideMaps = ({ pickup, dropOff }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null); // Store current location
  const directionsRef = useRef(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error fetching current location:", error);
          // You can set a default location here if geolocation fails
          setCurrentLocation({ latitude: 33.6844, longitude: 73.0479 }); // Default to Islamabad coordinates
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const initializeMap = () => {
      if (
        !currentLocation ||
        !currentLocation.longitude ||
        !currentLocation.latitude
      ) {
        return;
      }

      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [currentLocation.longitude, currentLocation.latitude], // Use current location
        zoom: 12,
      });

      // Add Mapbox Directions Control
      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
        controls: {
          inputs: false,
          instructions: false,
        },
      });

      newMap.addControl(directionsRef.current, "top-left");
      setMap(newMap);

      return newMap;
    };

    if (currentLocation) {
      initializeMap();
    }

    // Cleanup on unmount or when the map changes
    return () => {
      if (map) {
        map.remove(); // Remove the map only if it's properly initialized
      }
    };
  }, [currentLocation]);

  useEffect(() => {
    if (pickup && dropOff && map && currentLocation) {
      // Convert pickup, dropOff, and currentLocation to arrays [longitude, latitude]
      const pickupCoordinates = [pickup.longitude, pickup.latitude];
      const dropOffCoordinates = [dropOff.longitude, dropOff.latitude];
      const currentCoordinates = [
        currentLocation.longitude,
        currentLocation.latitude,
      ];

      // Set Route: Current location → Pickup → Drop-off
      directionsRef.current.setOrigin(currentCoordinates);
      directionsRef.current.addWaypoint(0, pickupCoordinates); // Add pickup as waypoint
      directionsRef.current.setDestination(dropOffCoordinates); // Set drop-off as destination

      // Add Markers (wait for map to be fully initialized)
      if (map) {
        addMarker(currentCoordinates, "green"); // Current location
        addMarker(pickupCoordinates, "red"); // Pickup
        addMarker(dropOffCoordinates, "blue"); // Drop-off
      }

      // Fetch distance
      fetchDistance(pickupCoordinates, dropOffCoordinates);
    }
  }, [pickup, dropOff, map, currentLocation]);

  const fetchDistance = (pickupLocation, dropOffLocation) => {
    if (!pickupLocation || !dropOffLocation) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropOffLocation[0]},${dropOffLocation[1]}?access_token=${mapboxgl.accessToken}&geometries=geojson&overview=false&steps=false`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const distanceInMeters = data.routes[0].distance;
          const distanceInKm = (distanceInMeters / 1000).toFixed(2);
        } else {
          console.error("No route found");
        }
      })
      .catch((error) => console.error("Error fetching distance:", error));
  };

  const addMarker = (location, color) => {
    if (!location || !map) return; // Ensure map is initialized

    const markerElement = createCustomMarker(color);
    const marker = new mapboxgl.Marker({ element: markerElement })
      .setLngLat(location)
      .addTo(map); // Add marker only if map is defined
  };

  const createCustomMarker = (color) => {
    const marker = document.createElement("div");
    marker.style.backgroundColor = color;
    marker.style.borderRadius = "50%";
    marker.style.width = "20px";
    marker.style.height = "20px";
    marker.style.border = "2px solid white";
    return marker;
  };

  return <div ref={mapContainerRef} style={styles.mapContainer} />;
};

const styles = {
  mapContainer: {
    width: "100%",
    height: "400px",
    borderRadius: "8px",
    overflow: "hidden",
  },
};

export default RideMaps;
