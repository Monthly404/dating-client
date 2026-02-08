import React from "react";
import "./MeetingCard.css";
import type { Meeting } from "../types";
import { getFallbackImage } from "../utils/imageFallback";

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onClick }) => {
  /** 이미지 로드 실패 시 폴백 이미지로 대체 */
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = getFallbackImage(meeting.id);
  };

  return (
    <div className="meeting-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img
          src={meeting.image || getFallbackImage(meeting.id)}
          alt={meeting.title}
          className="card-image"
          onError={handleImageError}
        />
        {meeting.location && (
          <div className="card-location-overlay">{meeting.location}</div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{meeting.title}</h3>

        {/* 날짜 표시 로직 */}
        {(() => {
          const dateText = meeting.isOneTime
            ? meeting.oneTimeDate
            : meeting.time ||
              (meeting.regularDays?.length
                ? `매주 ${meeting.regularDays.join(", ")}`
                : "");
          return dateText ? <div className="card-date">{dateText}</div> : null;
        })()}

        {meeting.price && <div className="card-price">{meeting.price}</div>}

        {meeting.tags && meeting.tags.length > 0 && (
          <div className="card-tags">
            {meeting.tags.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
