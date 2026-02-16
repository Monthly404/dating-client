import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "./GoogleMap.css";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  latitude,
  longitude,
  height = "320px",
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="google-map-placeholder" style={{ height }}>
        API 키가 설정되지 않았습니다.
      </div>
    );
  }

  return (
    <div className="google-map-container" style={{ height }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: latitude, lng: longitude }}
          defaultZoom={15}
          gestureHandling={"cooperative"}
          disableDefaultUI={true}
          style={{ width: "100%", height: "100%" }}
          colorScheme="LIGHT"
        >
          <Marker position={{ lat: latitude, lng: longitude }} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
