import React from "react";
import "./MeetingCard.css";
import type { Meeting } from "../types";

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onClick }) => {
  return (
    <div className="meeting-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={meeting.image} alt={meeting.title} className="card-image" />
      </div>

      <div className="card-content">
        <div className="card-meta">{meeting.location}</div>
        <h3 className="card-title" style={{ whiteSpace: "pre-line" }}>
          {meeting.title}
        </h3>
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
