import React from "react";
import "./EmptyState.css";

interface EmptyStateProps {
  /** 표시할 메시지 */
  message?: string;
  /** 서브 메시지 (선택사항) */
  submessage?: string;
}

/**
 * 데이터가 없을 때 표시되는 Empty State 컴포넌트
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  message = "조건에 맞는 모임이 없습니다",
  submessage = "다른 필터 조건으로 검색해보세요",
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="40" fill="#E9ECEF" />
            <path
              d="M30 35C30 34.4477 30.4477 34 31 34H49C49.5523 34 50 34.4477 50 35V50C50 50.5523 49.5523 51 49 51H31C30.4477 51 30 50.5523 30 50V35Z"
              stroke="#ADB5BD"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M35 34V32C35 29.7909 36.7909 28 39 28H41C43.2091 28 45 29.7909 45 32V34"
              stroke="#ADB5BD"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="42" r="2" fill="#868E96" />
          </svg>
        </div>
        <h3 className="empty-state-title">{message}</h3>
        <p className="empty-state-description">{submessage}</p>
      </div>
    </div>
  );
};

export default EmptyState;
