import React from "react";
import { Marker } from "@react-google-maps/api";

const MatatuMarker = ({ vehicle }) => {
  if (!vehicle.lat || !vehicle.lng) return null;

  return (
    <Marker
      position={{ lat: vehicle.lat, lng: vehicle.lng }}
      label={vehicle.name}
      icon={{
        url: "https://maps.google.com/mapfiles/ms/icons/bus.png",
        scaledSize: new window.google.maps.Size(40, 40),
      }}
    />
  );
};

export default MatatuMarker;
