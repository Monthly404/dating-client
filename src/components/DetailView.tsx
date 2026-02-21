import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailView.css";
import "./common/Skeleton.css"; // Skeleton 스타일 추가
import SEO from "./common/SEO";
import { Container } from "./common/Container";
import { Button } from "./common/Button";
import EmptyState from "./common/EmptyState";
import { useGetDatingGroup } from "../queries/useDatingQueries";
import {
  formatAgeGroup,
  formatAiKeywords,
  formatDatingSchedule,
  formatLocation,
  formatPrice,
  formatTags,
} from "../utils/datingFormat";
import { getFallbackImage, handleImageError } from "../utils/imageFallback";
import { Tag } from "./common/Tag";
import GoogleMap from "./common/GoogleMap";

const AiDescriptionInner: React.FC<{ text: string }> = ({ text }) => {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (displayedLength >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayedLength((prev) => Math.min(prev + 1, text.length));
    }, 40);
    return () => clearTimeout(timer);
  }, [displayedLength, text]);

  return (
    <div className="ai-description-section">
      <div className="ai-description-header">
        <span className="ai-badge">AI</span>
        <span>AI 큐레이터의 코멘트</span>
      </div>
      <p className="ai-description-text">
        {text.slice(0, displayedLength)}
        {displayedLength < text.length && (
          <span className="ai-cursor">|</span>
        )}
      </p>
    </div>
  );
};

const AiDescription: React.FC<{ text: string }> = ({ text }) => (
  <AiDescriptionInner key={text} text={text} />
);

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: datingGroup,
    isLoading,
    isError,
  } = useGetDatingGroup(Number(id));

  const numericId = Number(id);

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
    formatAgeGroup(datingGroup.minAge, datingGroup.maxAge) || "연령 제한 없음";
  const tags = formatTags(datingGroup);
  const aiKeywords = formatAiKeywords(datingGroup);

  return (
    <div className="detail-page">
      <SEO
        title={datingGroup.name}
        description={`${locationStr}에서 진행되는 ${datingGroup.name}. ${priceStr}, ${ageGroupStr}. ${timeStr || ""}`}
        image={datingGroup.thumbnail}
        url={`${window.location.origin}/meeting/${id}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: datingGroup.name,
          description: `${locationStr}에서 진행되는 ${datingGroup.name}`,
          image: datingGroup.thumbnail,
          url: `${window.location.origin}/meeting/${id}`,
          ...(datingGroup.schedule?.schedules?.[0] && {
            startDate: datingGroup.schedule.schedules[0],
          }),
          ...(datingGroup.address && {
            location: {
              "@type": "Place",
              name: locationStr,
              address: {
                "@type": "PostalAddress",
                addressLocality: datingGroup.address.gugun || "",
                streetAddress: datingGroup.address.road || "",
                addressCountry: "KR",
              },
            },
          }),
          ...(datingGroup.vendor?.name && {
            organizer: {
              "@type": "Organization",
              name: datingGroup.vendor.name,
            },
          }),
          ...(datingGroup.price != null && {
            offers: {
              "@type": "Offer",
              price: datingGroup.price,
              priceCurrency: "KRW",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
      <Container>
        <div className="detail-card">
          <div
            className={`detail-grid ${
              !(datingGroup.address?.latitude && datingGroup.address?.longitude)
                ? "detail-grid--no-map"
                : ""
            }`}
          >
            <div className="visual-section">
              <div className="detail-image-wrapper">
                <img
                  src={datingGroup.thumbnail || getFallbackImage(numericId)}
                  alt={datingGroup.name}
                  className="detail-image"
                  onError={(e) => handleImageError(e, numericId)}
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
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </div>

                {aiKeywords.length > 0 && (
                  <div className="ai-keywords-container">
                    <span className="ai-label">AI</span>
                    {aiKeywords.map((keyword, index) => (
                      <Tag key={index} className="ai-keyword-tag">
                        {keyword}
                      </Tag>
                    ))}
                  </div>
                )}

                {datingGroup.aiDescription && (
                  <AiDescription text={datingGroup.aiDescription} />
                )}
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

          {datingGroup.address?.latitude && datingGroup.address?.longitude && (
            <div className="map-section">
              <h3>오시는 길</h3>
              <GoogleMap
                latitude={datingGroup.address.latitude}
                longitude={datingGroup.address.longitude}
              />
              <p className="map-address">
                {datingGroup.address.road || datingGroup.address.gugun}
                {datingGroup.address.detail && (
                  <span className="map-address-detail">
                    {datingGroup.address.detail}
                  </span>
                )}
              </p>
              <p className="map-notice">
                정확한 모임 장소는 상세 정보 확인하기 버튼을 눌러 확인하세요.
              </p>
            </div>
          )}

        </div>
      </Container>
    </div>
  );
};

export default DetailView;
