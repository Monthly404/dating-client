import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

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
      <div
        style={{
          width: "100%",
          height,
          borderRadius: "16px",
          backgroundColor: "#f1f3f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#868e96",
          fontSize: "0.9rem",
        }}
      >
        API 키가 설정되지 않았습니다.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
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
