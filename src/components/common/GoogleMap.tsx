import React, { useEffect } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import "./GoogleMap.css";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  height?: string;
}

const CircleOverlay: React.FC<{ latitude: number; longitude: number }> = ({
  latitude,
  longitude,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const circle = new google.maps.Circle({
      map,
      center: { lat: latitude, lng: longitude },
      radius: 200,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      strokeColor: "#4285F4",
      strokeOpacity: 0.4,
      strokeWeight: 2,
    });

    return () => {
      circle.setMap(null);
    };
  }, [map, latitude, longitude]);

  return null;
};

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
          <CircleOverlay latitude={latitude} longitude={longitude} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
