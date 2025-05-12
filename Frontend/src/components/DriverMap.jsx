import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useSocket } from "../context/SocketContext"; // Import the socket context
import "mapbox-gl/dist/mapbox-gl.css";
import {jwtDecode} from "jwt-decode";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJkdWxoYW5hbmNoIiwiYSI6ImNtYTg0bjFwaTE1eTAybXNpbnN4ZjhtdDkifQ.OTr8OcuHq7i2ihESOqDMwg";

const DriverMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [driverId, setDriverId] = useState(null);
  const { socket, isConnected } = useSocket(); // Use the socket context
  const watchIdRef = useRef(null);

  // Function to update location in localStorage and send to server
  const updateLocation = (latitude, longitude) => {
    console.log("Updating location:", { latitude, longitude });
    localStorage.setItem(
      "driverLocation",
      JSON.stringify({ latitude, longitude })
    );
    
    if (driverId && isConnected) {
      socket.emit("locationUpdate", { driverId, longitude, latitude });
    }
  };

  // Function to get current location and update it
  const getAndUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  // Decode JWT and set driver ID
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDriverId(decoded.id);
        // Get initial location when driver ID is set
        getAndUpdateLocation();
      } catch (err) {
        console.error("JWT Decoding Error:", err);
      }
    }
  }, []);

  // Listen for location update requests from server
  useEffect(() => {
    if (isConnected) {
      socket.on("sendLocationUpdate", () => {
        const storedLocation = JSON.parse(
          localStorage.getItem("driverLocation")
        );
        if (storedLocation && driverId) {
          const { latitude, longitude } = storedLocation;
          socket.emit("locationUpdate", { driverId, longitude, latitude });
        } else {
          // If no stored location, get current location
          getAndUpdateLocation();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("sendLocationUpdate");
      }
    };
  }, [isConnected, driverId, socket]);

  // Initialize Mapbox map with GeolocateControl and watch position
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [73.0551, 33.6844],
      zoom: 12,
    });

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
    });

    mapRef.current.addControl(geolocateControl);

    // Handle geolocate event (when user clicks the button)
    geolocateControl.on("geolocate", (e) => {
      const { latitude, longitude } = e.coords;
      updateLocation(latitude, longitude);
    });

    // Start watching position
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div style={styles.container}>
      <div ref={mapContainerRef} style={styles.mapContainer} />
    </div>
  );
};

const styles = {
  container: { position: "relative" },
  mapContainer: { width: "100%", height: "400px", borderRadius: "8px" },
};

export default DriverMap;
