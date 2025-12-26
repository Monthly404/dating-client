import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSection from "./FilterSection";
import MeetingCard from "./MeetingCard";
import "./MainView.css";
import { HERO_SLIDES } from "../constants";

const MainView: React.FC = () => {
  const navigate = useNavigate();
  const [isMapView, setIsMapView] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = () => {
    // In a real app, we would pass the meeting ID here
    navigate("/meeting/1");
  };

  return (
    <div className="main-view">
      <div className="container">
        <section className="hero-section">
          <h2>지금 뜨는 인기 모임</h2>
          <div className="hero-carousel">
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

            <div className="carousel-dots">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2>전체 모임</h2>
          </div>

          <div className="content-layout">
            <aside className="sidebar">
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
              <FilterSection />
            </aside>

            {isMapView ? (
              <div className="map-view-placeholder">
                <div className="map-content">
                  🗺️ 지도 뷰가 여기에 표시됩니다
                </div>
              </div>
            ) : (
              <div className="meeting-grid">
                <MeetingCard onClick={handleCardClick} />
                <MeetingCard onClick={handleCardClick} />
                <MeetingCard onClick={handleCardClick} />
                <MeetingCard onClick={handleCardClick} />
                <MeetingCard onClick={handleCardClick} />
                <MeetingCard onClick={handleCardClick} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainView;
