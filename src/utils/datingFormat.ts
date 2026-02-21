import type { DatingResponse, DatingScheduleResponse } from "../types/dating";
import { DAY_MAP, formatDateTime } from "./dateFormat";

/**
 * 소개팅 일정 정보를 포맷팅
 * @param schedule 일정 정보
 * @returns 포맷된 일정 문자열
 */
export const formatDatingSchedule = (
  schedule?: DatingScheduleResponse,
  separator: string = "\n",
): string => {
  if (!schedule) return "";

  const isOneTime = schedule.type === "INSTANT";

  if (isOneTime && schedule.schedules?.[0]) {
    // 단발성 모임: "M월 D일 (요일) HH:MM"
    const date = new Date(schedule.schedules[0]);
    return formatDateTime(date);
  } else if (schedule.repeatSchedules && schedule.repeatSchedules.length > 0) {
    // 정기 모임: 요일별 시간 그룹화
    const dayToTimes = new Map<string, string[]>();
    const dayOrder = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    // 요일 순서대로 정렬
    const sortedSchedules = [...schedule.repeatSchedules].sort(
      (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
    );

    sortedSchedules.forEach((sch) => {
      // "13:30:00" -> "13:30" or "16:00:00" -> "16"
      const [h, m] = sch.time.split(":");
      const hour = Number(h); // "09" -> 9, "16" -> 16
      const time = m === "00" ? `${hour}시` : `${hour}:${m}`;

      if (!dayToTimes.has(sch.day)) {
        dayToTimes.set(sch.day, []);
      }
      const times = dayToTimes.get(sch.day);
      if (times && !times.includes(time)) {
        times.push(time);
      }
    });

    // 각 요일별 시간 정렬
    dayToTimes.forEach((times) => times.sort());

    // 시간 구성이 같은 요일끼리 그룹화
    const timeToDays = new Map<string, string[]>();
    dayOrder.forEach((day) => {
      if (dayToTimes.has(day)) {
        const times = dayToTimes.get(day);
        const timeSignature = times!.join(", ");

        if (!timeToDays.has(timeSignature)) {
          timeToDays.set(timeSignature, []);
        }
        timeToDays.get(timeSignature)!.push(day);
      }
    });

    // 문자열 생성
    const parts: string[] = [];
    let isFirst = true;

    timeToDays.forEach((days, timeSignature) => {
      const dayString = days.map((d) => DAY_MAP[d] || d).join(", ");
      const prefix = isFirst ? "매주 " : "";
      parts.push(`${prefix}${dayString} ${timeSignature}`);
      isFirst = false;
    });

    return parts.join(separator);
  }

  return "";
};

/**
 * 주소 정보를 포맷팅
 * @param datingGroup 소개팅 그룹 정보
 * @returns 포맷된 주소 문자열
 */
export const formatLocation = (datingGroup: DatingResponse): string => {
  if (!datingGroup.address) return "";
  return `${datingGroup.address.sido} · ${datingGroup.address.gugun}`;
};

/**
 * 가격 정보를 포맷팅
 * @param price 가격
 * @returns 포맷된 가격 문자열
 */
export const formatPrice = (price?: number): string => {
  if (price === 0) return "무료";
  if (!price) return ""; // null/undefined일 경우 빈 문자열 반환 (혹은 '무료'로 할지 정책에 따름. 여기선 기존 !price가 무료였으므로 0도 포함. 안전하게 둘 분리)
  return `${price.toLocaleString()}원 ~`;
};

/**
 * 연령대 정보를 포맷팅
 * 예: minAge=25, maxAge=35 → "20대~30대"
 * 예: minAge=20, maxAge=29 → "20대"
 */
export const formatAgeGroup = (minAge?: number, maxAge?: number): string => {
  if (!minAge || !maxAge) return "";
  const minDecade = Math.floor(minAge / 10) * 10;
  const maxDecade = Math.floor(maxAge / 10) * 10;
  const decades: string[] = [];
  for (let d = minDecade; d <= maxDecade; d += 10) {
    decades.push(`${d}대`);
  }
  return decades.join(", ");
};

/**
 * 태그 정보를 포맷팅
 * @param datingGroup 소개팅 그룹 정보
 * @returns 포맷된 태그 배열
 */
export const formatTags = (datingGroup: DatingResponse): string[] => {
  return (
    datingGroup.tags
      ?.filter((tag) => tag.value)
      .map((tag) => `#${tag.value}`) || []
  );
};

/**
 * AI 키워드만 추출
 * @param datingGroup 소개팅 그룹 정보
 * @returns AI 키워드 값 배열
 */
export const formatAiKeywords = (datingGroup: DatingResponse): string[] => {
  return (
    datingGroup.keywords
      ?.filter((keyword) => keyword.type === "AI")
      .map((keyword) => keyword.value) || []
  );
};
