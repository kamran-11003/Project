import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { useRideContext } from "../context/rideContext";

const MapboxDirections = require("@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions");

mapboxgl.accessToken =
"pk.eyJ1IjoiYWJkdWxoYW5hbmNoIiwiYSI6ImNtYTg0bjFwaTE1eTAybXNpbnN4ZjhtdDkifQ.OTr8OcuHq7i2ihESOqDMwg";

const geocodeAddress = (address) => {
  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${mapboxgl.accessToken}`;

  return fetch(geocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].center; // [longitude, latitude]
        return coordinates;
      } else {
        console.error("Address not found:", address);
        return null;
      }
    })
    .catch((error) => {
      console.error("Geocoding error:", error);
      return null;
    });
};

const MapComponent = ({ pickup, dropOff }) => {
  const mapContainerRef = useRef(null);
  const directionsRef = useRef(null);
  const [localPickupCoords, setLocalPickupCoords] = useState(null);
  const [localDropOffCoords, setLocalDropOffCoords] = useState(null);

  const { setDistance, setPickupCoordinates, setDropOffCoordinates } = useRideContext();

  const fetchDistance = useCallback((pickupLocation, dropOffLocation) => {
    if (!pickupLocation || !dropOffLocation) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropOffLocation[0]},${dropOffLocation[1]}?access_token=${mapboxgl.accessToken}&geometries=geojson&overview=false&steps=false`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
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
      .catch((error) => {
        console.error("Error fetching distance from Mapbox:", error);
      });
  }, [setDistance]);

  useEffect(() => {
    if (pickup && dropOff) {
      Promise.all([geocodeAddress(pickup), geocodeAddress(dropOff)]).then(
        ([pickupCoords, dropOffCoords]) => {
          if (pickupCoords && dropOffCoords) {
            setLocalPickupCoords(pickupCoords);
            setLocalDropOffCoords(dropOffCoords);
            directionsRef.current.setOrigin(pickupCoords);
            directionsRef.current.setDestination(dropOffCoords);

            setPickupCoordinates({
              latitude: pickupCoords[1],
              longitude: pickupCoords[0],
            });
            setDropOffCoordinates({
              latitude: dropOffCoords[1],
              longitude: dropOffCoords[0],
            });

            fetchDistance(pickupCoords, dropOffCoords);
          }
        }
      );
    }
  }, [pickup, dropOff, setPickupCoordinates, setDropOffCoordinates, fetchDistance]);

  useEffect(() => {
    if (localPickupCoords && localDropOffCoords) {
      fetchDistance(localPickupCoords, localDropOffCoords);
    }
  }, [localPickupCoords, localDropOffCoords, fetchDistance]);

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [73.0551, 33.6844], // Default to Islamabad
        zoom: 12,
      });

      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
        controls: {
          inputs: false,
          instructions: false,
        },
        interactive: false,
      });

      // Add Directions Control
      newMap.addControl(directionsRef.current, "top-left");

      // Add Geolocate Control
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });

      newMap.addControl(geolocateControl);

      // Center map to user's location upon geolocation success
      geolocateControl.on("geolocate", (e) => {
        const { latitude, longitude } = e.coords;
        setPickupCoordinates({ latitude, longitude });
        directionsRef.current.setOrigin([longitude, latitude]);
        newMap.flyTo({ center: [longitude, latitude], zoom: 14 });
        console.log(`User location: ${latitude}, ${longitude}`);
      });

      return newMap;
    };

    const mapInstance = initializeMap();

    return () => mapInstance.remove();
  }, []);

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

export default MapComponent;
