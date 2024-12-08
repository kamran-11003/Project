import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRideContext } from "../context/rideContext";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
const MapboxDirections = require("@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions");

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ";

const RideMap = ({ driverLocation, pickup, dropOff }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const directionsRef = useRef(null);
  const { setDistance } = useRideContext();

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map(
        {
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: driverLocation, // Default to Islamabad coordinates
          zoom: 12,
        },
        [driverLocation]
      );

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

    const mapInstance = initializeMap();

    return () => mapInstance.remove(); // Cleanup on unmount
  }, [driverLocation]);

  useEffect(() => {
    if (pickup && dropOff && map) {
      // Set Route: Driver → Pickup → Drop-off
      directionsRef.current.setOrigin(driverLocation);
      directionsRef.current.addWaypoint(0, pickup); // Add pickup as waypoint
      directionsRef.current.setDestination(dropOff); // Set drop-off as destination

      // Add Markers
      addMarker(driverLocation, "green"); // Driver
      addMarker(pickup, "red"); // Pickup
      addMarker(dropOff, "blue"); // Drop-off

      // Fetch distance
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
          setDistance(distanceInKm);
        } else {
          console.error("No route found");
        }
      })
      .catch((error) => console.error("Error fetching distance:", error));
  };

  const addMarker = (location, color) => {
    if (!location) return;

    const markerElement = createCustomMarker(color);
    new mapboxgl.Marker({ element: markerElement })
      .setLngLat(location)
      .addTo(map);
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

export default RideMap;
