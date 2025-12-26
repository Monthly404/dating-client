import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css";
import SEO from "./common/SEO";
import { MEETINGS } from "../constants";
import { Container } from "./common/Container";
import { Button } from "./common/Button";
import { Tag } from "./common/Tag";

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const meeting = MEETINGS.find((m) => m.id === Number(id));

  // Scroll to top when DetailView mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!meeting) {
    return (
      <div className="detail-page">
        <Container>
          <div className="detail-card">
            <h2 style={{ padding: "40px", textAlign: "center" }}>
              모임을 찾을 수 없습니다.
            </h2>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <SEO
        title={meeting.title.replace(/\n/g, " ")}
        description={`${meeting.location}에서 진행되는 ${meeting.title}입니다. ${meeting.subtitle}`}
        image={meeting.image}
      />
      <Container>
        <div className="detail-card">
          <div className="detail-grid">
            {/* Left: Visuals */}
            <div className="visual-section">
              <div className="detail-image-wrapper">
                <img
                  src={meeting.image}
                  alt={meeting.title}
                  className="detail-image"
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="info-section">
              <div className="info-header">
                <span className="info-category">{meeting.location}</span>
                <h1 className="info-title" style={{ whiteSpace: "pre-line" }}>
                  {meeting.title}
                </h1>
                <div className="info-price">{meeting.price}</div>
              </div>

              <div className="info-body">
                <div className="info-row">
                  <span className="label">업체명</span>
                  <span className="value">{meeting.company || "소개팅각"}</span>
                </div>
                <div className="info-row">
                  <span className="label">일시</span>
                  <span className="value">{meeting.time || "주말 상시"}</span>
                </div>
                <div className="info-row">
                  <span className="label">참여연령</span>
                  <span className="value">{meeting.ageGroup || "2030"}</span>
                </div>

                <div className="tags-container">
                  {meeting.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </div>
              </div>

              <Button size="lg" fullWidth>
                방문 예약하기
              </Button>
            </div>
          </div>

          <div className="map-section">
            <h3>오시는 길</h3>
            <div className="map-placeholder">
              {meeting.location.split(" · ")[0]} 지도 영역
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DetailView;
