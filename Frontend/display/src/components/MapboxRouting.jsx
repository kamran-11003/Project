import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxRouting = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userCoordinates, setUserCoordinates] = useState(null); // Store user's current location
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);
  const [info, setInfo] = useState("");

  const mapboxToken = "pk.eyJ1Ijoia2FtcmFuLTAwMyIsImEiOiJjbTQzM3NoOWowNzViMnFzNHBwb2wwZ2k0In0.DHxC51GY9USAaRFeqH7awQ";
  const geocodingEndpoint = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
  const directionsEndpoint = "https://api.mapbox.com/directions/v5/mapbox/driving/";

  useEffect(() => {
    if (!mapboxToken) {
      console.error("Mapbox token is required!");
      return;
    }
    mapboxgl.accessToken = mapboxToken;

    // Initialize Mapbox map
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 13,
    });

    // Set user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude];
        setUserCoordinates(coords); // Save user's coordinates for proximity
        map.current.setCenter(coords);
        new mapboxgl.Marker().setLngLat(coords).addTo(map.current);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to fetch location. Check location permissions.");
      }
    );
  }, []);

  const fetchSuggestions = async (query, proximity) => {
    const proximityParam = proximity ? `&proximity=${proximity.join(",")}` : "";
    const response = await fetch(
      `${geocodingEndpoint}${encodeURIComponent(query)}.json?access_token=${mapboxToken}${proximityParam}`
    );
    const data = await response.json();
    return data.features.map((feature) => ({
      name: feature.place_name,
      coordinates: feature.center,
    }));
  };

  const setupAutocomplete = (inputId, setCoordinates) => {
    const inputElement = document.getElementById(inputId);
    inputElement.addEventListener("input", async (e) => {
      const query = e.target.value;
      if (query.length > 2) {
        const suggestions = await fetchSuggestions(query, userCoordinates);
        const list = document.createElement("ul");
        list.style.position = "absolute";
        list.style.background = "white";
        list.style.border = "1px solid #ccc";
        list.style.margin = "0";
        list.style.padding = "0";
        list.style.width = "200px";
        list.style.listStyleType = "none";
        list.innerHTML = "";

        suggestions.forEach((suggestion) => {
          const item = document.createElement("li");
          item.textContent = suggestion.name;
          item.style.padding = "5px";
          item.style.cursor = "pointer";
          item.addEventListener("click", () => {
            inputElement.value = suggestion.name;
            setCoordinates(suggestion.coordinates);
            list.remove();
          });
          list.appendChild(item);
        });
        inputElement.parentNode.appendChild(list);
      }
    });
  };

  const drawRoute = async () => {
    if (!startCoordinates || !endCoordinates) return;

    const response = await fetch(
      `${directionsEndpoint}${startCoordinates.join(",")};${endCoordinates.join(",")}.json?access_token=${mapboxToken}&geometries=geojson`
    );
    const data = await response.json();
    const route = data.routes[0];
    const distance = (route.distance / 1000).toFixed(2); // Distance in km
    const duration = (route.duration / 60).toFixed(2); // Duration in minutes

    setInfo(`Distance: ${distance} km, Duration: ${duration} mins`);

    if (map.current.getSource("route")) {
      map.current.removeLayer("route");
      map.current.removeSource("route");
    }

    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: route.geometry,
      },
    });

    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0074D9",
        "line-width": 5,
      },
    });
  };

  useEffect(() => {
    setupAutocomplete("start", setStartCoordinates);
    setupAutocomplete("end", setEndCoordinates);
  }, [userCoordinates]); // Run once userCoordinates are set

  useEffect(() => {
    if (startCoordinates && endCoordinates) {
      drawRoute();
    }
  }, [startCoordinates, endCoordinates]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div
        id="inputs"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <input id="start" type="text" placeholder="Start Location" style={{ width: "200px", marginBottom: "5px" }} />
        <input id="end" type="text" placeholder="End Location" style={{ width: "200px", marginBottom: "5px" }} />
        <div id="info">{info}</div>
      </div>
      <div ref={mapContainer} style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }} />
    </div>
  );
};

export default MapboxRouting;
