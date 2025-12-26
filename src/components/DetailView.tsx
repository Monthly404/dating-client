import React from "react";
import "./DetailView.css";
import meetingImg from "../assets/meeting_wine.png";

const DetailView: React.FC = () => {
  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-grid">
          {/* Left: Visuals */}
          <div className="visual-section">
            <div className="detail-image-wrapper">
              <img src={meetingImg} alt="Detail" className="detail-image" />
              <span className="location-badge">서울 강남구</span>
            </div>
          </div>

          {/* Right: Info */}
          <div className="info-section">
            <div className="info-header">
              <span className="info-category">와인/커피 · 소셜</span>
              <h1 className="info-title">
                프리미엄 와인과 함께하는
                <br />
                금요 파티
              </h1>
              <div className="info-price">50,000원</div>
            </div>

            <div className="info-body">
              <div className="info-row">
                <span className="label">업체명</span>
                <span className="value">와인소셜클럽</span>
              </div>
              <div className="info-row">
                <span className="label">일시</span>
                <span className="value">매주 금요일 19:30</span>
              </div>
              <div className="info-row">
                <span className="label">인원</span>
                <span className="value">최대 8명 (2030)</span>
              </div>

              <div className="tags-container">
                <span className="tag">#와인</span>
                <span className="tag">#네트워킹</span>
                <span className="tag">#전문소믈리에</span>
                <span className="tag">#애프터파티</span>
              </div>
            </div>

            <button className="primary-action-btn">방문 예약하기</button>
          </div>
        </div>

        <div className="map-section">
          <h3>오시는 길</h3>
          <div className="map-placeholder">지도 영역</div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
