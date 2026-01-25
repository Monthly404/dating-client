import React from "react";
import "./MeetingCard.css";
import type { Meeting } from "../types";

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onClick }) => {
  /** 이미지 로드 실패 시 폴백 이미지로 대체 */
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/fallback-image.png";
  };

  return (
    <div className="meeting-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img
          src={meeting.image || "/fallback-image.png"}
          alt={meeting.title}
          className="card-image"
          onError={handleImageError}
        />
        <div className="card-location-overlay">{meeting.location}</div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{meeting.title}</h3>

        <div className="card-date">
          {meeting.isOneTime
            ? meeting.oneTimeDate
            : `매주 ${meeting.regularDays?.join(", ")}`}
        </div>

        <div className="card-price">{meeting.price}</div>
        <div className="card-tags">
          {meeting.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
