import React, { useEffect, useState } from "react";
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
import { DEFAULT_SIZE } from "../constants/search";
import { useInfiniteSearchDatingGroups } from "../queries/useDatingQueries";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { DatingResponse, DatingFilterParam } from "../types/dating";
import type { Meeting } from "../types";
import { DAY_MAP, formatShortDate } from "../utils/dateFormat";
import {
  formatAgeGroup,
  formatDatingSchedule,
  formatPrice,
  formatTags,
} from "../utils/datingFormat";

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
const transformDatingGroupToMeeting = (group: DatingResponse): Meeting => {
  const isOneTime = group.schedule?.type === "INSTANT";

  // 시간 문자열 생성
  const timeStr = formatDatingSchedule(group.schedule, " / ");
  let oneTimeDate = "";
  let regularDays: string[] | undefined;

  if (isOneTime && group.schedule?.schedules?.[0]) {
    // 단발성 모임: "M.D(요일)" 형식만 추출 (카드 UI용)
    const date = new Date(group.schedule.schedules[0]);
    oneTimeDate = formatShortDate(date);
  } else if (group.schedule?.repeatSchedules) {
    // 정기 모임: 기존 regularDays 유지 (혹시 모를 하위 호환성)
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
    ageGroup: formatAgeGroup(group.minAge, group.maxAge),
    company: group.vendor?.name || "",
    isOneTime,
    regularDays,
    oneTimeDate,
  };
};

const MainView: React.FC = () => {
  const navigate = useNavigate();

  /** 현재 히어로 슬라이드 인덱스 */
  const [currentSlide, setCurrentSlide] = useState(0);

  /** 적용된 필터 목록 */
  const [filters, setFilters] = useState<DatingFilterParam[]>([]);

  /** 정렬 방식 */
  const [sortBy, setSortBy] = useState<"RECOMMEND" | "LATEST">("RECOMMEND");

  /** 소개팅 모임 목록 조회 (무한 스크롤) */
  const {
    data: pagingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchDatingGroups({
    sort: sortBy,
    size: DEFAULT_SIZE,
    filters: filters,
  });

  /** 무한 스크롤 감지 */
  const { targetRef } = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  /** API 응답을 UI용 Meeting 배열로 변환 (Pages Flattening) */
  const meetings: Meeting[] =
    pagingData?.pages.flatMap((page) =>
      page.datings.map(transformDatingGroupToMeeting),
    ) || [];

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
          <div className="section-header">
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
            {/* 사이드바: 필터 */}
            <aside className="sidebar">
              <FilterSection onApply={handleApplyFilters} />
            </aside>

            {/* 목록 뷰 */}
            <div className="list-container">
              {isLoading ? (
                <div className="meeting-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <MeetingCardSkeleton key={i} />
                  ))}
                </div>
              ) : meetings.length > 0 ? (
                <>
                  <div className="meeting-grid">
                    {meetings.map((meeting) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onClick={() => handleCardClick(meeting.id)}
                      />
                    ))}
                  </div>
                  {/* 무한 스크롤 감지 영역 */}
                  <div ref={targetRef} className="scroll-sentinel">
                    {isFetchingNextPage && (
                      <div className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default MainView;
