import React from "react";
import "./MeetingCard.css";
import type { Meeting } from "../types";
import { getFallbackImage, handleImageError } from "../utils/imageFallback";
import { Tag } from "./common/Tag";

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onClick }) => {
  return (
    <div
      className="meeting-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="card-image-wrapper">
        <img
          src={meeting.image || getFallbackImage(meeting.id)}
          alt={meeting.title}
          className="card-image"
          onError={(e) => handleImageError(e, meeting.id)}
        />
        {meeting.company && (
          <div className="card-company-overlay">{meeting.company}</div>
        )}
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
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        )}

        {meeting.aiKeywords && meeting.aiKeywords.length > 0 && (
          <div className="card-ai-keywords">
            <span className="ai-label">AI</span>
            {meeting.aiKeywords.map((keyword, index) => (
              <Tag key={index} className="ai-keyword-tag">
                {keyword}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
