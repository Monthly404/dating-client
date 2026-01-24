import type {
  DatingGroupResponse,
  DatingScheduleResponse,
} from "../types/dating";
import { DAY_MAP, formatDateTime } from "./dateFormat";

/**
 * 소개팅 일정 정보를 포맷팅
 * @param schedule 일정 정보
 * @returns 포맷된 일정 문자열
 */
export const formatDatingSchedule = (
  schedule?: DatingScheduleResponse,
): string => {
  if (!schedule) return "";

  const isOneTime = schedule.type === "INSTANT";

  if (isOneTime && schedule.schedules?.[0]) {
    // 단발성 모임: "M월 D일 (요일) HH:MM"
    const date = new Date(schedule.schedules[0]);
    return formatDateTime(date);
  } else if (schedule.repeatSchedules) {
    // 정기 모임: "매주 월, 수, 금 14:30"
    const time = schedule.repeatSchedules[0]?.time?.substring(0, 5) || "";
    const days = schedule.repeatSchedules
      .map((s) => DAY_MAP[s.day] || s.day)
      .join(", ");
    return `매주 ${days} ${time}`;
  }

  return "";
};

/**
 * 주소 정보를 포맷팅
 * @param datingGroup 소개팅 그룹 정보
 * @returns 포맷된 주소 문자열
 */
export const formatLocation = (datingGroup: DatingGroupResponse): string => {
  if (!datingGroup.address) return "위치 정보 없음";
  return `${datingGroup.address.sido} · ${datingGroup.address.gugun}`;
};

/**
 * 가격 정보를 포맷팅
 * @param price 가격
 * @returns 포맷된 가격 문자열
 */
export const formatPrice = (price?: number): string => {
  if (!price) return "무료";
  return `${price.toLocaleString()}원~`;
};

/**
 * 나이대 정보를 포맷팅
 * @param ageRange 나이대 범위 [최소, 최대]
 * @returns 포맷된 나이대 문자열
 */
export const formatAgeRange = (ageRange?: number[]): string => {
  if (!ageRange || ageRange.length < 2) return "연령 제한 없음";
  return `${ageRange[0]}~${ageRange[1]}세`;
};

/**
 * 태그 정보를 포맷팅
 * @param datingGroup 소개팅 그룹 정보
 * @returns 포맷된 태그 배열
 */
export const formatTags = (datingGroup: DatingGroupResponse): string[] => {
  return (
    datingGroup.tags
      ?.filter((tag) => tag.value)
      .map((tag) => `#${tag.value}`) || []
  );
};
