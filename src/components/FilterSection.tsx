import React, { useState, useEffect, useMemo } from "react";
import "./FilterSection.css";
import {
  SEOUL_DISTRICTS,
  SEOUL_DISTRICT_CODES,
  MAIN_DISTRICT_CODES,
  DAYS_OF_WEEK,
  TIME_SLOTS,
  MEETING_CONCEPTS,
} from "../constants";
import { ChipGroup } from "./common/ChipGroup";
import type { DatingFilterParam, DayOfWeek, TimeRange } from "../types/dating";

interface FilterSectionProps {
  /** 필터 적용 시 호출되는 콜백 */
  onApply: (filters: DatingFilterParam[]) => void;
}

/** 한글 요일 → 영문 요일 Enum 변환 맵 */
const DAY_MAP: Record<string, DayOfWeek> = {
  월: "MONDAY",
  화: "TUESDAY",
  수: "WEDNESDAY",
  목: "THURSDAY",
  금: "FRIDAY",
  토: "SATURDAY",
  일: "SUNDAY",
};

/** 한글 시간대 → 영문 시간대 Enum 변환 맵 */
const TIME_MAP: Record<string, TimeRange> = {
  오전: "MORNING",
  오후: "AFTERNOON",
  저녁: "EVENING",
  밤: "NIGHT",
};

/** 운영 주체 옵션 */
const ORGANIZER_TYPES = ["전체", "지자체", "사설"] as const;

/** 가격 슬라이더 최소값 */
const PRICE_MIN = 10000;

/** 가격 슬라이더 최대값 (전체) */
const PRICE_MAX = 100000;

/** 가격 슬라이더 단위 */
const PRICE_STEP = 10000;

/** 데스크톱 브레이크포인트 */
const DESKTOP_BREAKPOINT = 768;

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * 1개월 후 날짜를 YYYY-MM-DD 형식으로 반환
 */
const getOneMonthLaterString = (): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const FilterSection: React.FC<FilterSectionProps> = ({ onApply }) => {
  /** 모바일에서 필터 모달 열림 여부 */
  const [isOpen, setIsOpen] = useState(false);

  /** 날짜 필터 - 시작일 */
  const [startDate, setStartDate] = useState(getTodayString);

  /** 날짜 필터 - 종료일 */
  const [endDate, setEndDate] = useState(getOneMonthLaterString);

  /** 날짜가 사용자에 의해 수정되었는지 여부 */
  const [dateModified, setDateModified] = useState(false);

  /** 지역 필터 - 선택된 행정동 코드 목록 */
  const [selectedRegionCodes, setSelectedRegionCodes] = useState<string[]>([]);

  /** 요일 필터 - 선택된 요일 목록 */
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  /** 시간대 필터 - 선택된 시간대 목록 */
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  /** 가격 필터 - 최대 가격 (100000 = 전체) */
  const [priceRange, setPriceRange] = useState(PRICE_MAX);

  /** 운영 주체 필터 - 선택된 운영 주체 ("" = 전체) */
  const [selectedType, setSelectedType] = useState<string>("");

  /** 기타 컨셉 필터 - 선택된 컨셉 목록 */
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);

  /** 마지막으로 적용된 필터 상태 */
  const [appliedState, setAppliedState] = useState({
    dateModified: false,
    startDate: getTodayString(),
    endDate: getOneMonthLaterString(),
    selectedRegionCodes: [] as string[],
    selectedDays: [] as string[],
    selectedTimes: [] as string[],
    priceRange: PRICE_MAX,
    selectedType: "",
    selectedConcepts: [] as string[],
  });

  /** 배열 비교 헬퍼 함수 */
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  };

  /** 필터 변경 여부 감지 - 적용된 상태와 비교 */
  const hasChanges = useMemo(() => {
    return (
      dateModified !== appliedState.dateModified ||
      (dateModified &&
        (startDate !== appliedState.startDate ||
          endDate !== appliedState.endDate)) ||
      !arraysEqual(selectedRegionCodes, appliedState.selectedRegionCodes) ||
      !arraysEqual(selectedDays, appliedState.selectedDays) ||
      !arraysEqual(selectedTimes, appliedState.selectedTimes) ||
      priceRange !== appliedState.priceRange ||
      selectedType !== appliedState.selectedType ||
      !arraysEqual(selectedConcepts, appliedState.selectedConcepts)
    );
  }, [
    dateModified,
    startDate,
    endDate,
    selectedRegionCodes,
    selectedDays,
    selectedTimes,
    priceRange,
    selectedType,
    selectedConcepts,
    appliedState,
  ]);

  /** 모바일 모달 열릴 때 배경 스크롤 방지 */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  /** 화면 크기가 데스크톱으로 변경되면 모달 닫기 */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > DESKTOP_BREAKPOINT && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  /**
   * 배열 타입 필터의 선택/해제 토글
   * @param list 현재 선택된 항목 배열
   * @param setList 상태 업데이트 함수
   * @param item 토글할 항목
   */
  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  /**
   * ChipGroup용 토글 핸들러 생성
   * @param state 현재 상태
   * @param setState 상태 업데이트 함수
   * @returns 토글 핸들러 함수
   */
  const handleToggle =
    (
      state: string[],
      setState: React.Dispatch<React.SetStateAction<string[]>>,
    ) =>
    (item: string) => {
      toggleSelection(state, setState, item);
    };

  /**
   * 날짜 변경 핸들러
   * @param setter 날짜 상태 setter
   * @returns onChange 핸들러
   */
  const handleDateChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setDateModified(true);
    };

  /**
   * 필터 적용 버튼 클릭 핸들러
   * 현재 선택된 필터를 API 형식으로 변환하여 부모 컴포넌트에 전달
   */
  const handleApply = () => {
    const filters: DatingFilterParam[] = [];

    // 1. 날짜 필터 (사용자가 수정한 경우에만)
    if (dateModified) {
      filters.push({
        type: "SCHEDULE_PERIOD",
        startDate: startDate,
        endDate: endDate,
      });
    }

    // 2. 지역 필터 (행정동 코드)
    if (selectedRegionCodes.length > 0) {
      const otherCode = SEOUL_DISTRICT_CODES["기타"];
      const hasOther = selectedRegionCodes.includes(otherCode);

      if (hasOther) {
        // "기타"가 포함된 경우
        const selectedMainCodes = selectedRegionCodes.filter(
          (code) => code !== otherCode,
        );

        if (selectedMainCodes.length === 0) {
          // "기타"만 선택된 경우: 4개 주요 구를 exclude
          filters.push({
            type: "REGION_CODE",
            includes: [],
            excludes: MAIN_DISTRICT_CODES,
          });
        } else {
          // "기타"와 다른 구가 함께 선택된 경우
          // 선택된 구는 includes, 선택되지 않은 주요 구는 excludes
          const excludeCodes = MAIN_DISTRICT_CODES.filter(
            (code) => !selectedMainCodes.includes(code),
          );
          filters.push({
            type: "REGION_CODE",
            includes: selectedMainCodes,
            excludes: excludeCodes,
          });
        }
      } else {
        // "기타"가 선택되지 않은 경우: 기존 로직 (선택된 구만 includes)
        filters.push({
          type: "REGION_CODE",
          includes: selectedRegionCodes,
          excludes: [],
        });
      }
    }

    // 3. 요일 필터
    if (selectedDays.length > 0) {
      const enumDays = selectedDays.map((d) => DAY_MAP[d]).filter(Boolean);
      if (enumDays.length > 0) {
        filters.push({
          type: "DAYS",
          days: enumDays,
        });
      }
    }

    // 4. 시간대 필터
    if (selectedTimes.length > 0) {
      const enumTimes = selectedTimes.map((t) => TIME_MAP[t]).filter(Boolean);
      if (enumTimes.length > 0) {
        filters.push({
          type: "TIME_RANGE",
          timeRanges: enumTimes,
        });
      }
    }

    // 6. 가격 필터 (최대값보다 작은 경우에만)
    if (priceRange < PRICE_MAX) {
      filters.push({
        type: "PRICE_RANGE",
        minPrice: 0,
        maxPrice: priceRange,
      });
    }

    // 7. 운영 주체 필터
    if (selectedType) {
      filters.push({
        type: "ETC",
        tagType: "ORGANIZER",
        value: selectedType,
      });
    }

    // 8. 컨셉 필터
    selectedConcepts.forEach((concept) => {
      filters.push({
        type: "ETC",
        tagType: "CONCEPT",
        value: concept,
      });
    });

    // 현재 상태를 적용된 상태로 저장
    setAppliedState({
      dateModified,
      startDate,
      endDate,
      selectedRegionCodes: [...selectedRegionCodes],
      selectedDays: [...selectedDays],
      selectedTimes: [...selectedTimes],
      priceRange,
      selectedType,
      selectedConcepts: [...selectedConcepts],
    });

    // 부모 컴포넌트로 필터 전달 및 모달 닫기
    onApply(filters);
    setIsOpen(false);
  };

  return (
    <>
      {/* 모바일: 필터 열기 버튼 */}
      <button className="mobile-filter-trigger" onClick={() => setIsOpen(true)}>
        <span className="filter-label">필터 설정</span>
      </button>

      {/* 필터 섹션 (데스크톱: 사이드바, 모바일: 모달) */}
      <aside className={`filter-section ${isOpen ? "is-open" : ""}`}>
        {/* 헤더 */}
        <div className="filter-header">
          <h3>필터</h3>
          <button className="close-filter-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {/* 스크롤 가능한 필터 컨텐츠 영역 */}
        <div className="filter-content-scroll">
          {/* 1. 날짜 필터 */}
          <div className="filter-group">
            <h4>기간</h4>
            <div className="date-range-container">
              <label className="date-input-label">
                <input
                  type="date"
                  className="filter-input-date"
                  placeholder="시작일"
                  value={startDate}
                  onChange={handleDateChange(setStartDate)}
                />
                <span className="label-text">부터</span>
              </label>
              <label className="date-input-label">
                <input
                  type="date"
                  className="filter-input-date"
                  placeholder="종료일"
                  value={endDate}
                  onChange={handleDateChange(setEndDate)}
                />
                <span className="label-text">까지</span>
              </label>
            </div>
          </div>

          {/* 2. 지역 필터 */}
          <div className="filter-group">
            <h4>지역</h4>
            <div className="district-grid">
              {SEOUL_DISTRICTS.map((district) => {
                const regionCode = SEOUL_DISTRICT_CODES[district];
                return (
                  <button
                    key={district}
                    className={`district-btn ${
                      selectedRegionCodes.includes(regionCode) ? "active" : ""
                    }`}
                    onClick={() =>
                      toggleSelection(
                        selectedRegionCodes,
                        setSelectedRegionCodes,
                        regionCode,
                      )
                    }
                  >
                    {district}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 요일 필터 */}
          <div className="filter-group">
            <h4>요일</h4>
            <div className="day-toggles">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  className={`day-btn ${
                    selectedDays.includes(day) ? "active" : ""
                  }`}
                  onClick={() =>
                    toggleSelection(selectedDays, setSelectedDays, day)
                  }
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* 4. 시간대 필터 */}
          <div className="filter-group">
            <h4>시간대</h4>
            <ChipGroup
              items={TIME_SLOTS}
              selectedItems={selectedTimes}
              onToggle={handleToggle(selectedTimes, setSelectedTimes)}
            />
          </div>

          {/* 6. 가격 필터 */}
          <div className="filter-group">
            <div className="price-header">
              <h4>가격대</h4>
              <span className="price-value">
                {priceRange === PRICE_MAX
                  ? "전체"
                  : `${priceRange / 10000}만원 이하`}
              </span>
            </div>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-labels">
              <span>1만원</span>
              <span>전체</span>
            </div>
          </div>

          {/* 7. 운영 주체 필터 */}
          <div className="filter-group">
            <h4>운영 주체</h4>
            <div className="segment-control">
              {ORGANIZER_TYPES.map((type) => (
                <button
                  key={type}
                  className={`segment-btn ${
                    selectedType === type ||
                    (type === "전체" && selectedType === "")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setSelectedType(type === "전체" ? "" : type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 8. 기타 컨셉 필터 */}
          <div className="filter-group">
            <h4>기타</h4>
            <ChipGroup
              items={MEETING_CONCEPTS}
              selectedItems={selectedConcepts}
              onToggle={handleToggle(selectedConcepts, setSelectedConcepts)}
            />
          </div>
        </div>

        {/* Sticky Footer: 필터 적용 버튼 */}
        <div className="filter-action-footer">
          <button
            className="apply-filter-btn"
            onClick={handleApply}
            disabled={!hasChanges}
          >
            필터 적용하기
          </button>
        </div>
      </aside>

      {/* 모바일: 모달 배경 */}
      {isOpen && (
        <div className="filter-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default FilterSection;
