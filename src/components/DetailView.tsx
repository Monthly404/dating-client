import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailView.css";
import "./common/Skeleton.css"; // Skeleton 스타일 추가
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
import { getFallbackImage } from "../utils/imageFallback";
import KakaoMap from "./common/KakaoMap";

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
    e.currentTarget.src = getFallbackImage(Number(id));
  };

  // 페이지 로드 시 최상단으로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 로딩 중 (Skeleton UI)
  if (isLoading) {
    return (
      <div className="detail-page">
        <Container>
          <div className="detail-card">
            <div className="detail-grid">
              {/* 왼쪽 이미지 영역 스켈레톤 */}
              <div className="visual-section">
                <div className="detail-image-wrapper">
                  <div className="skeleton skeleton-rect" />
                </div>
              </div>

              {/* 오른쪽 정보 영역 스켈레톤 */}
              <div className="info-section">
                <div className="info-header" style={{ border: "none" }}>
                  <div
                    className="skeleton skeleton-text"
                    style={{ width: "60px", marginBottom: "1rem" }}
                  />
                  <div className="skeleton skeleton-title" />
                  <div
                    className="skeleton skeleton-text"
                    style={{ width: "120px", height: "2rem" }}
                  />
                </div>

                <div className="info-body">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "80%" }}
                    />
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "60%" }}
                    />
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "40%" }}
                    />
                  </div>
                  <div
                    className="skeleton"
                    style={{
                      height: "32px",
                      marginTop: "2rem",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                  />
                </div>

                <div
                  className="skeleton"
                  style={{
                    height: "56px",
                    borderRadius: "16px",
                    marginTop: "auto",
                  }}
                />
              </div>
            </div>

            {/* 하단 지도 영역 스켈레톤 */}
            <div className="map-section" style={{ marginTop: "3rem" }}>
              <div
                className="skeleton skeleton-title"
                style={{ width: "150px", height: "1.5rem" }}
              />
              <div
                className="skeleton"
                style={{ height: "320px", borderRadius: "16px" }}
              />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (isError || !datingGroup) {
    return (
      <div className="detail-page detail-error-container">
        <Container>
          <div className="detail-error-content">
            <EmptyState
              className="detail-empty-state"
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
                  src={datingGroup.thumbnail || getFallbackImage(Number(id))}
                  alt={datingGroup.name}
                  className="detail-image"
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="info-section">
              <div className="info-header">
                {locationStr && (
                  <span className="info-category">{locationStr}</span>
                )}
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
                {datingGroup.link ? "상세 정보 확인하기" : "상세 정보 준비중"}
              </Button>
            </div>
          </div>

          <div className="map-section">
            <h3>오시는 길</h3>
            {datingGroup.address?.latitude && datingGroup.address?.longitude ? (
              <div style={{ marginTop: "16px" }}>
                <KakaoMap
                  latitude={datingGroup.address.latitude}
                  longitude={datingGroup.address.longitude}
                />
                <p style={{ marginTop: "12px", fontSize: "0.95rem" }}>
                  {datingGroup.address.road || datingGroup.address.gugun}
                  {datingGroup.address.detail && (
                    <span
                      style={{
                        color: "var(--color-secondary)",
                        marginLeft: "8px",
                      }}
                    >
                      {datingGroup.address.detail}
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="map-placeholder">
                <p>
                  {datingGroup.address?.road ||
                    datingGroup.address?.gugun ||
                    ""}
                </p>
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "0.85rem",
                    color: "var(--color-secondary)",
                  }}
                >
                  지도 정보를 불러올 수 없습니다
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DetailView;
