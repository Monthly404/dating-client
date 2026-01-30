import React from "react";
import "./MeetingCard.css";
import "./common/Skeleton.css";

const MeetingCardSkeleton: React.FC = () => {
  return (
    <div className="meeting-card" style={{ cursor: "default" }}>
      <div className="card-image-wrapper">
        <div
          className="skeleton skeleton-rect"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      <div className="card-content">
        <div
          className="skeleton skeleton-title"
          style={{ height: "1.5rem", marginBottom: "0.5rem" }}
        />

        <div
          className="skeleton skeleton-text"
          style={{ width: "60%", marginBottom: "1rem" }}
        />

        <div
          className="skeleton skeleton-text"
          style={{ width: "40%", height: "1.2rem", marginTop: "auto" }}
        />

        <div className="card-tags" style={{ marginTop: "12px" }}>
          <div
            className="skeleton"
            style={{ width: "40px", height: "24px", borderRadius: "6px" }}
          />
          <div
            className="skeleton"
            style={{ width: "50px", height: "24px", borderRadius: "6px" }}
          />
          <div
            className="skeleton"
            style={{ width: "30px", height: "24px", borderRadius: "6px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingCardSkeleton;
