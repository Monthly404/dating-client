import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSection from "./FilterSection";
import MeetingCard from "./MeetingCard";
import MeetingCardSkeleton from "./MeetingCardSkeleton";
import EmptyState from "./common/EmptyState";
import SEO from "./common/SEO";
import { Container } from "./common/Container";
import { Select } from "./common/Select";
import "./MainView.css";
import { HERO_SLIDES } from "../constants";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "../constants/search";
import { useSearchDatingGroups } from "../queries/useDatingQueries";
import type { DatingGroupResponse, DatingFilterParam } from "../types/dating";
import type { Meeting } from "../types";
import { DAY_MAP, formatDateTime, formatShortDate } from "../utils/dateFormat";
import { formatPrice, formatTags } from "../utils/datingFormat";

/** 정렬 옵션 */
const SORT_OPTIONS = [
  { value: "recommend", label: "추천순" },
  { value: "latest", label: "최신순" },
];

/** 히어로 캐러셀 자동 전환 시간 (밀리초) */
const CAROUSEL_INTERVAL = 5000;

/**
 * API에서 받은 DatingGroupResponse를 UI용 Meeting 타입으로 변환
 * @param group API 응답 데이터
 * @returns Meeting 객체
 */
const transformDatingGroupToMeeting = (group: DatingGroupResponse): Meeting => {
  const isOneTime = group.schedule?.type === "INSTANT";

  // 시간 문자열 생성
  let timeStr = "";
  let oneTimeDate = "";
  let regularDays: string[] | undefined;

  if (isOneTime && group.schedule?.schedules?.[0]) {
    // 단발성 모임: "M월 D일 (요일) HH:MM"
    const date = new Date(group.schedule.schedules[0]);
    timeStr = formatDateTime(date);
    oneTimeDate = formatShortDate(date);
  } else if (group.schedule?.repeatSchedules) {
    // 정기 모임: "매주 월, 수, 금 14:30"
    const time = group.schedule.repeatSchedules[0]?.time?.substring(0, 5) || "";
    const days = group.schedule.repeatSchedules
      .map((s) => DAY_MAP[s.day] || s.day)
      .join(", ");
    timeStr = `매주 ${days} ${time}`;
    regularDays = group.schedule.repeatSchedules.map(
      (s) => DAY_MAP[s.day] || s.day,
    );
  }

  return {
    id: group.id,
    title: group.name,
    subtitle: group.tags?.map((t) => t.value).join(", ") || "",
    image: group.thumbnail || "",
    location: group.address?.gugun || "",
    price: formatPrice(group.price),
    tags: formatTags(group),
    time: timeStr,
    ageGroup: group.ageRange ? `${group.ageRange[0]}~${group.ageRange[1]}` : "",
    company: group.vendor?.name || "",
    isOneTime,
    regularDays,
    oneTimeDate,
  };
};

const MainView: React.FC = () => {
  const navigate = useNavigate();

  /** 지도 뷰 활성화 여부 */
  const [isMapView, setIsMapView] = useState(false);

  /** 현재 히어로 슬라이드 인덱스 */
  const [currentSlide, setCurrentSlide] = useState(0);

  /** 적용된 필터 목록 */
  const [filters, setFilters] = useState<DatingFilterParam[]>([]);

  /** 정렬 방식 */
  const [sortBy, setSortBy] = useState<"RECOMMEND" | "LATEST">("RECOMMEND");

  /** 소개팅 모임 목록 조회 */
  const { data: pagingData, isLoading } = useSearchDatingGroups({
    sort: sortBy,
    page: DEFAULT_PAGE,
    size: DEFAULT_SIZE,
    filters: filters,
  });

  /** API 응답을 UI용 Meeting 배열로 변환 */
  const meetings: Meeting[] =
    pagingData?.datings?.map(transformDatingGroupToMeeting) || [];

  /** 히어로 캐러셀 자동 전환 */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  /** 모임 카드 클릭 시 상세 페이지로 이동 */
  const handleCardClick = (id: number) => {
    navigate(`/meeting/${id}`);
  };

  /** 필터 적용 시 필터 상태 업데이트 */
  const handleApplyFilters = (newFilters: DatingFilterParam[]) => {
    setFilters(newFilters);
  };

  return (
    <div className="main-view">
      <SEO />
      <Container>
        {/* 히어로 섹션 */}
        <section className="hero-section">
          <h2>지금 뜨는 인기 모임</h2>
          <div className="hero-carousel">
            {/* 슬라이드 목록 */}
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`hero-slide ${
                  index === currentSlide ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="hero-overlay">
                  <h3 style={{ whiteSpace: "pre-line" }}>{slide.title}</h3>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            ))}

            {/* 인디케이터 도트 */}
            <div className="carousel-dots">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`슬라이드 ${index + 1}로 이동`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 컨텐츠 섹션 */}
        <section className="content-section">
          {/* 섹션 헤더 */}
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>전체 모임</h2>
            <Select
              options={SORT_OPTIONS}
              value={sortBy.toLowerCase()}
              onChange={(e) =>
                setSortBy(
                  e.target.value.toUpperCase() as "RECOMMEND" | "LATEST",
                )
              }
            />
          </div>

          {/* 레이아웃: 사이드바 + 메인 컨텐츠 */}
          <div className="content-layout">
            {/* 사이드바: 뷰 전환 + 필터 */}
            <aside className="sidebar">
              {/* 목록/지도 뷰 토글 */}
              <div className="view-toggle-container">
                <button
                  className={`view-toggle-btn ${!isMapView ? "active" : ""}`}
                  onClick={() => setIsMapView(false)}
                >
                  목록
                </button>
                <button
                  className={`view-toggle-btn ${isMapView ? "active" : ""}`}
                  onClick={() => setIsMapView(true)}
                >
                  지도
                </button>
              </div>

              {/* 필터 섹션 */}
              <FilterSection onApply={handleApplyFilters} />
            </aside>

            {/* 메인 컨텐츠: 지도 뷰 또는 목록 뷰 */}
            {isMapView ? (
              // 지도 뷰 (추후 구현 예정)
              <div className="map-view-placeholder">
                <div className="map-content">
                  🗺️ 지도 뷰가 여기에 표시됩니다
                </div>
              </div>
            ) : (
              // 목록 뷰
              <div style={{ flex: 1, width: "100%" }}>
                {isLoading ? (
                  <div className="meeting-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <MeetingCardSkeleton key={i} />
                    ))}
                  </div>
                ) : meetings.length > 0 ? (
                  <div className="meeting-grid">
                    {meetings.map((meeting) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onClick={() => handleCardClick(meeting.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            )}
          </div>
        </section>
      </Container>
    </div>
  );
};

export default MainView;
