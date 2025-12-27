import React, { useState, useEffect } from "react";
import "./FilterSection.css";
import {
  SEOUL_DISTRICTS,
  DAYS_OF_WEEK,
  TIME_SLOTS,
  AGE_GROUPS,
  MEETING_CONCEPTS,
} from "../constants";
import { ChipGroup } from "./common/ChipGroup";

const FilterSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when modal is open (Mobile only)
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

  // Reset modal state on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // States
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(100000);

  // New States
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);

  // Helper Toggle Functions
  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleToggle =
    (
      state: string[],
      setState: React.Dispatch<React.SetStateAction<string[]>>
    ) =>
    (item: string) => {
      toggleSelection(state, setState, item);
    };

  return (
    <>
      {/* Mobile Trigger Button */}
      <button className="mobile-filter-trigger" onClick={() => setIsOpen(true)}>
        <span className="filter-label">필터 설정</span>
      </button>

      {/* Filter Section: Sidebar on Desktop, Modal on Mobile */}
      <aside className={`filter-section ${isOpen ? "is-open" : ""}`}>
        <div className="filter-header">
          <h3>필터</h3>
          {/* Close button for Mobile Modal */}
          <button className="close-filter-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="filter-content-scroll">
          {/* 1. Date Range */}
          <div className="filter-group">
            <h4>기간</h4>
            <div className="date-range-container">
              <label className="date-input-label">
                <input
                  type="date"
                  className="filter-input-date"
                  placeholder="시작일"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="label-text">부터</span>
              </label>
              <label className="date-input-label">
                <input
                  type="date"
                  className="filter-input-date"
                  placeholder="종료일"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <span className="label-text">까지</span>
              </label>
            </div>
          </div>

          {/* 2. Region */}
          <div className="filter-group">
            <h4>지역</h4>
            <div className="district-grid">
              {SEOUL_DISTRICTS.map((district) => (
                <button
                  key={district}
                  className={`district-btn ${
                    selectedDistricts.includes(district) ? "active" : ""
                  }`}
                  onClick={() =>
                    toggleSelection(
                      selectedDistricts,
                      setSelectedDistricts,
                      district
                    )
                  }
                >
                  {district}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Days */}
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

          {/* 4. Time */}
          <div className="filter-group">
            <h4>시간대</h4>
            <ChipGroup
              items={TIME_SLOTS}
              selectedItems={selectedTimes}
              onToggle={handleToggle(selectedTimes, setSelectedTimes)}
            />
          </div>

          {/* 5. Age */}
          <div className="filter-group">
            <h4>연령대</h4>
            <ChipGroup
              items={AGE_GROUPS}
              selectedItems={selectedAges}
              onToggle={handleToggle(selectedAges, setSelectedAges)}
            />
          </div>

          {/* 6. Price */}
          <div className="filter-group">
            <div className="price-header">
              <h4>가격대</h4>
              <span className="price-value">
                {priceRange === 100000
                  ? "전체"
                  : `${priceRange / 10000}만원 이하`}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-labels">
              <span>1만원</span>
              <span>전체</span>
            </div>
          </div>

          {/* 7. Type */}
          <div className="filter-group">
            <h4>운영 주체</h4>
            <div className="segment-control">
              {["전체", "지자체", "사설"].map((type) => (
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

          {/* 8. Other (Concepts) */}
          <div className="filter-group">
            <h4>기타</h4>
            <ChipGroup
              items={MEETING_CONCEPTS}
              selectedItems={selectedConcepts}
              onToggle={handleToggle(selectedConcepts, setSelectedConcepts)}
            />
          </div>

          {/* Removed 'Done' button as per request */}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="filter-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default FilterSection;
