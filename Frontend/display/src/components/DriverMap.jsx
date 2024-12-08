import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useSocket } from "../context/SocketContext"; // Import the socket context
import "mapbox-gl/dist/mapbox-gl.css";
import {jwtDecode} from "jwt-decode";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ";

const DriverMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [driverId, setDriverId] = useState(null);
  const { socket, isConnected } = useSocket(); // Use the socket context

  // Decode JWT and set driver ID
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDriverId(decoded.id);
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
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("sendLocationUpdate");
      }
    };
  }, [isConnected, driverId, socket]);

  // Initialize Mapbox map with GeolocateControl
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

    geolocateControl.on("geolocate", (e) => {
      const { latitude, longitude } = e.coords;
      console.log("Current location:", latitude, longitude);
      localStorage.setItem(
        "driverLocation",
        JSON.stringify({ latitude, longitude })
      );
    });

    return () => mapRef.current?.remove();
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
