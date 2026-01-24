import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css";
import SEO from "./common/SEO";
import { Container } from "./common/Container";
import { Button } from "./common/Button";
import { Tag } from "./common/Tag";
import { useGetDatingGroup } from "../queries/useDatingQueries";
import {
  formatDatingSchedule,
  formatLocation,
  formatPrice,
  formatAgeRange,
  formatTags,
} from "../utils/datingFormat";

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
          <div className="detail-card">
            <h2 style={{ padding: "40px", textAlign: "center" }}>
              모임을 찾을 수 없습니다.
            </h2>
          </div>
        </Container>
      </div>
    );
  }

  // 데이터 포맷팅
  const timeStr = formatDatingSchedule(datingGroup.schedule);
  const locationStr = formatLocation(datingGroup);
  const priceStr = formatPrice(datingGroup.price);
  const ageGroupStr = formatAgeRange(datingGroup.ageRange);
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
                    {datingGroup.tags?.find((t) => t.type === "ORGANIZER")
                      ?.value || "소개팅.zip"}
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
              </div>

              <Button
                size="lg"
                fullWidth
                onClick={() => {
                  if (datingGroup.link) {
                    window.open(datingGroup.link, "_blank");
                  }
                }}
              >
                방문 예약하기
              </Button>
            </div>
          </div>

          <div className="map-section">
            <h3>오시는 길</h3>
            <div className="map-placeholder">
              {datingGroup.address?.gugun || "위치"} 지도 영역
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DetailView;
