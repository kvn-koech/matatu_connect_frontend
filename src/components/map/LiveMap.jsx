import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import MatatuMarker from "./MatatuMarker";

const containerStyle = { width: "100%", height: "500px" };
const STEP_MS = 100; // update frequency

const LiveMap = ({ vehicles = [], centerVehicle, showRoutes = false }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [animatedVehicles, setAnimatedVehicles] = useState([]);
  const vehiclePositions = useRef({});

  // Initialize vehicle positions
  useEffect(() => {
    vehicles.forEach((v) => {
      if (!vehiclePositions.current[v.id]) {
        // Use the distributed start index from AppContext if available
        vehiclePositions.current[v.id] = { idx: v._posIndex || 0, progress: 0 };
      }
    });
  }, [vehicles]);

  // Animate vehicles along routes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedVehicles(
        vehicles.map((v) => {
          const route = v.route || [];
          if (route.length < 2) return v;

          let { idx, progress } = vehiclePositions.current[v.id];
          const start = route[idx];
          const end = route[(idx + 1) % route.length];

          const lat = start.lat + (end.lat - start.lat) * progress;
          const lng = start.lng + (end.lng - start.lng) * progress;

          progress += 0.001; // speed control (very slow)
          if (progress >= 1) {
            progress = 0;
            idx = (idx + 1) % route.length;
          }

          vehiclePositions.current[v.id] = { idx, progress };
          return { ...v, lat, lng };
        })
      );
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [vehicles]);

  if (!isLoaded) return <div>Loading map...</div>;

  const mapCenter = centerVehicle
    ? { lat: centerVehicle.lat, lng: centerVehicle.lng }
    : animatedVehicles.length > 0
      ? { lat: animatedVehicles[0].lat, lng: animatedVehicles[0].lng }
      : { lat: -1.2921, lng: 36.8219 };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
      {animatedVehicles.map((v) => (
        <MatatuMarker key={v.id} vehicle={v} />
      ))}

      {/* Routes hidden as per user request to remove markings */}
      {/* {showRoutes && vehicles.map((v) =>
        v.route && v.route.length > 1 ? (
          <Polyline
            key={v.id}
            path={v.route}
            options={{ strokeColor: "#F59E0B", strokeOpacity: 0.7, strokeWeight: 4 }}
          />
        ) : null
      )} */}
    </GoogleMap>
  );
};

export default LiveMap;
