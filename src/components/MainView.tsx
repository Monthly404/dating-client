import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSection from "./FilterSection";
import MeetingCard from "./MeetingCard";
import SEO from "./common/SEO";
import { Container } from "./common/Container";
import { Select } from "./common/Select";
import "./MainView.css";
import { HERO_SLIDES } from "../constants";
import { useSearchDatingGroups } from "../queries/useDatingQueries";
import type { DatingGroupResponse, DatingFilterParam } from "../types/dating";
import type { Meeting } from "../types";

/** 영문 요일을 한글로 변환하는 맵 */
const DAY_MAP: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

/** 정렬 옵션 */
const SORT_OPTIONS = [
  { value: "recommend", label: "추천순" },
  { value: "latest", label: "최신순" },
  { value: "low-price", label: "낮은가격순" },
];

/** 히어로 캐러셀 자동 전환 시간 (밀리초) */
const CAROUSEL_INTERVAL = 5000;

/**
 * Date 객체에서 요일 인덱스를 가져와 한글 요일로 변환
 * @param date Date 객체
 * @returns 한글 요일 (예: "월", "화")
 */
const getKoreanDay = (date: Date): string => {
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const dayKey = Object.keys(DAY_MAP)[dayIndex];
  return DAY_MAP[dayKey] || "";
};

/**
 * Date 객체를 시간 문자열로 포맷 (예: "14:30")
 * @param date Date 객체
 * @returns 시간 문자열
 */
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Date 객체를 "M월 D일 (요일) HH:MM" 형식으로 포맷
 * @param date Date 객체
 * @returns 포맷된 날짜/시간 문자열
 */
const formatDateTime = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const koreanDay = getKoreanDay(date);
  const time = formatTime(date);
  return `${month}월 ${day}일 ${koreanDay} ${time}`;
};

/**
 * Date 객체를 "M.D(요일)" 형식으로 포맷
 * @param date Date 객체
 * @returns 포맷된 날짜 문자열 (예: "12.24(금)")
 */
const formatShortDate = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const koreanDay = getKoreanDay(date);
  return `${month}.${day}(${koreanDay})`;
};

/**
 * API에서 받은 DatingGroupResponse를 UI용 Meeting 타입으로 변환
 * @param group API 응답 데이터
 * @param index 인덱스 (임시 ID로 사용)
 * @returns Meeting 객체
 */
const transformDatingGroupToMeeting = (
  group: DatingGroupResponse,
  index: number
): Meeting => {
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
      (s) => DAY_MAP[s.day] || s.day
    );
  }

  return {
    id: index,
    title: group.name,
    subtitle: group.tags?.map((t) => t.value).join(", ") || "",
    image: group.thumbnail || "",
    location: group.address?.gugun || "",
    price: group.price ? `${group.price.toLocaleString()}원` : "무료",
    tags: group.tags?.map((t) => `#${t.value}`) || [],
    time: timeStr,
    ageGroup: group.ageRange ? `${group.ageRange[0]}~${group.ageRange[1]}` : "",
    company: "",
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

  /** 소개팅 모임 목록 조회 */
  const { data: pagingData, isLoading } = useSearchDatingGroups({
    page: 1,
    size: 20,
    filters: filters,
  });

  /** API 응답을 UI용 Meeting 배열로 변환 */
  const meetings: Meeting[] =
    pagingData?.datingGroups.map(transformDatingGroupToMeeting) || [];

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
            <h2>
              전체 모임{" "}
              {pagingData?.totalCount ? `(${pagingData.totalCount})` : ""}
            </h2>
            <Select options={SORT_OPTIONS} defaultValue="recommend" />
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
              <div className="meeting-grid">
                {isLoading ? (
                  <div>Loading...</div>
                ) : meetings.length > 0 ? (
                  meetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onClick={() => handleCardClick(meeting.id)}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    조건에 맞는 모임이 없습니다.
                  </div>
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
