/** 영문 요일을 한글로 변환하는 맵 */
export const DAY_MAP: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

/**
 * Date 객체에서 요일 인덱스를 가져와 한글 요일로 변환
 * @param date Date 객체
 * @returns 한글 요일 (예: "월", "화")
 */
export const getKoreanDay = (date: Date): string => {
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const dayKey = Object.keys(DAY_MAP)[dayIndex];
  return DAY_MAP[dayKey] || "";
};

/**
 * Date 객체를 시간 문자열로 포맷 (예: "14:30")
 * @param date Date 객체
 * @returns 시간 문자열
 */
export const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Date 객체를 "M월 D일 (요일) HH:MM" 형식으로 포맷
 * @param date Date 객체
 * @returns 포맷된 날짜/시간 문자열
 */
export const formatDateTime = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const koreanDay = getKoreanDay(date);
  const time = formatTime(date);
  return `${month}월 ${day}일 (${koreanDay}) ${time}`;
};

/**
 * Date 객체를 "M.D(요일)" 형식으로 포맷
 * @param date Date 객체
 * @returns 포맷된 날짜 문자열 (예: "12.24(금)")
 */
export const formatShortDate = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const koreanDay = getKoreanDay(date);
  return `${month}.${day}(${koreanDay})`;
};
