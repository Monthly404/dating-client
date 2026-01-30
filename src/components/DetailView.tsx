import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailView.css";
import SEO from "./common/SEO";
import { Container } from "./common/Container";
import { Button } from "./common/Button";
import EmptyState from "./common/EmptyState";
import { useGetDatingGroup } from "../queries/useDatingQueries";
import {
  formatDatingSchedule,
  formatLocation,
  formatPrice,
  formatTags,
} from "../utils/datingFormat";

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: datingGroup,
    isLoading,
    isError,
  } = useGetDatingGroup(Number(id));

  /** 이미지 로드 실패 시 폴백 이미지로 대체 */
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/fallback-image.png";
  };

  // 페이지 로드 시 최상단으로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="detail-page">
        <Container>
          <div className="detail-card">
            <h2 style={{ padding: "40px", textAlign: "center" }}>로딩 중...</h2>
          </div>
        </Container>
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (isError || !datingGroup) {
    return (
      <div className="detail-page">
        <Container>
          <div
            className="detail-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              padding: "40px",
            }}
          >
            <EmptyState
              message="모임을 찾을 수 없습니다"
              submessage="요청하신 모임이 존재하지 않거나 정보가 올바르지 않습니다."
            />
            <Button onClick={() => navigate("/")} size="md">
              홈으로 돌아가기
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // 데이터 포맷팅
  const timeStr = formatDatingSchedule(datingGroup.schedule);
  const locationStr = formatLocation(datingGroup);
  const priceStr = formatPrice(datingGroup.price);
  const ageGroupStr =
    datingGroup.ageRange && datingGroup.ageRange.length >= 2
      ? `${datingGroup.ageRange[0]}~${datingGroup.ageRange[1]}세`
      : "연령 제한 없음";
  const tags = formatTags(datingGroup);

  return (
    <div className="detail-page">
      <SEO
        title={datingGroup.name}
        description={`${locationStr}에서 진행되는 ${datingGroup.name}입니다.`}
        image={datingGroup.thumbnail}
      />
      <Container>
        <div className="detail-card">
          <div className="detail-grid">
            <div className="visual-section">
              <div className="detail-image-wrapper">
                <img
                  src={datingGroup.thumbnail || "/fallback-image.png"}
                  alt={datingGroup.name}
                  className="detail-image"
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="info-section">
              <div className="info-header">
                <span className="info-category">{locationStr}</span>
                <h1 className="info-title" style={{ whiteSpace: "pre-line" }}>
                  {datingGroup.name}
                </h1>
                <div className="info-price">{priceStr}</div>
              </div>

              <div className="info-body">
                <div className="info-row">
                  <span className="label">업체명</span>
                  <span className="value">
                    {datingGroup.vendor?.name || "업체 정보 없음"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">일시</span>
                  <span className="value">{timeStr || "일정 정보 없음"}</span>
                </div>
                <div className="info-row">
                  <span className="label">참여연령</span>
                  <span className="value">{ageGroupStr}</span>
                </div>

                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                fullWidth
                disabled={!datingGroup.link}
                onClick={() => {
                  if (datingGroup.link) {
                    window.open(datingGroup.link, "_blank");
                  }
                }}
              >
                {datingGroup.link ? "방문 예약하기" : "예약 링크 준비중"}
              </Button>
            </div>
          </div>

          <div className="map-section">
            <h3>오시는 길</h3>
            <div className="map-placeholder">
              <p>
                {datingGroup.address?.road ||
                  datingGroup.address?.gugun ||
                  "위치 정보 없음"}
              </p>
              {datingGroup.address?.detail && (
                <p
                  style={{
                    marginTop: "8px",
                    color: "var(--color-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  {datingGroup.address.detail}
                </p>
              )}
              <div
                style={{
                  marginTop: "16px",
                  fontSize: "0.85rem",
                  color: "var(--color-secondary)",
                }}
              >
                🗺️ 지도는 추후 업데이트될 예정입니다
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DetailView;
