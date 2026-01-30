import React, { useEffect, useRef, useState } from "react";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  height?: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  latitude,
  longitude,
  height = "320px",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // 1. 이미 스크립트가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    // 2. 스크립트가 이미 DOM에 존재하는지 확인
    const existingScript = document.getElementById("kakao-map-script");
    if (existingScript) {
      return;
    }

    const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;
    if (!apiKey) {
      console.warn("VITE_KAKAO_MAP_KEY is missing.");
      return; // 키가 없으면 로딩 시도 안 함 (UI에서 키 미설정 메시지 표시)
    }

    console.log("Loading Kakao Map with key:", apiKey); // 디버깅용 로그

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };

    script.onerror = () => {
      console.error("Kakao Map script failed to load.");
      setLoadError(true);
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (isLoaded && mapContainer.current) {
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);

      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    }
  }, [isLoaded, latitude, longitude]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: height,
        borderRadius: "16px",
        backgroundColor: "#f1f3f5",
        position: "relative",
      }}
    >
      {loadError ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fa5252",
            fontSize: "0.9rem",
            textAlign: "center",
            width: "100%",
            padding: "0 20px",
          }}
        >
          지도를 불러올 수 없습니다.
          <br />
          <span style={{ fontSize: "0.8rem", color: "#868e96" }}>
            (키 설정 또는 도메인 등록을 확인해주세요)
          </span>
        </div>
      ) : !isLoaded ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#868e96",
            fontSize: "0.9rem",
            textAlign: "center",
            width: "100%",
          }}
        >
          {import.meta.env.VITE_KAKAO_MAP_KEY
            ? "지도 불러오는 중..."
            : "API 키가 설정되지 않았습니다."}
        </div>
      ) : null}
    </div>
  );
};

export default KakaoMap;
