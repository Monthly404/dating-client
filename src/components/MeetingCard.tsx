import React from "react";
import "./MeetingCard.css";
import meetingImg from "../assets/meeting_wine.png";

interface MeetingCardProps {
  onClick: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ onClick }) => {
  return (
    <div className="meeting-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={meetingImg} alt="Meeting" className="card-image" />
      </div>

      <div className="card-content">
        <div className="card-meta">강남구 · 와인 클래스</div>
        <h3 className="card-title">프리미엄 와인과 함께하는 금요 파티</h3>
        <div className="card-price">50,000원</div>
        <div className="card-tags">
          <span>#직장인</span>
          <span>#2030</span>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
