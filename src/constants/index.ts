import heroParty from "../assets/hero_party.png";
import heroHiking from "../assets/hero_hiking.png";
import heroCoffee from "../assets/hero_coffee.png";
import type { SlideData } from "../types";

export const SEOUL_DISTRICTS = ["강남구", "서초구", "송파구", "마포구", "기타"];

export const DAYS_OF_WEEK = ["월", "화", "수", "목", "금", "토", "일"];

export const TIME_SLOTS = ["오전", "오후", "저녁", "밤"];

/** 서울시 구별 행정동 코드 매핑 (5자리) */
export const SEOUL_DISTRICT_CODES: Record<string, string> = {
  강남구: "11680",
  서초구: "11650",
  송파구: "11710",
  마포구: "11440",
  기타: "00000", // 기타는 특수 코드 (exclude 로직에서 처리)
};

/** 주요 4개 구의 행정동 코드 (기타 선택 시 exclude에 사용) */
export const MAIN_DISTRICT_CODES = ["11680", "11650", "11710", "11440"];

export const MEETING_CONCEPTS = [
  "애프터파티",
  "음주",
  "온라인",
  "키제한",
  "단발성",
];

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    image: heroParty,
    title: "이번 주말, \n루프탑 파티 어때요?",
    subtitle: "설레는 만남이 기다리고 있어요",
  },
  {
    id: 2,
    image: heroHiking,
    title: "가을 바람 맞으며 \n함께 떠나는 등산",
    subtitle: "건강한 취미를 함께해요",
  },
  {
    id: 3,
    image: heroCoffee,
    title: "따뜻한 카페에서 \n소소한 대화",
    subtitle: "부담 없는 커피 모임",
  },
];
