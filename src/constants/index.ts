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
import meetingWine from "../assets/meeting_wine.png";

export const MEETINGS: import("../types").Meeting[] = [
  {
    id: 1,
    title: "프리미엄 와인과 함께하는 금요 파티",
    subtitle: "와인소셜클럽에서 주최하는 2030 직장인 네트워킹",
    image: meetingWine,
    location: "강남구",
    price: "50,000원",
    tags: ["#직장인", "#2030", "#와인", "#네트워킹"],
    time: "매주 금요일 19:30",
    ageGroup: "20대 ~ 30대",
    company: "와인소셜클럽",
    isOneTime: false,
    regularDays: ["금"],
  },
  {
    id: 2,
    title: "토요일 오후, 한강 러닝 크루",
    subtitle: "건강한 땀방울 뒤에 이어지는 시원한 치맥",
    image: meetingWine, // Placeholder using same image for now
    location: "서초구",
    price: "10,000원",
    tags: ["#러닝", "#건강", "#뒷풀이"],
    time: "매주 토요일 16:00",
    ageGroup: "전연령",
    company: "런앤런",
    isOneTime: false,
    regularDays: ["토"],
  },
  {
    id: 3,
    title: "직장인 퇴근길 비어 챗",
    subtitle: "하루의 피로를 날리는 가벼운 맥주 한 잔",
    image: meetingWine,
    location: "용산구",
    price: "30,000원",
    tags: ["#맥주", "#대화", "#소개팅"],
    time: "매주 목요일 19:00",
    ageGroup: "2030",
    company: "비어챗",
    isOneTime: false,
    regularDays: ["목"],
  },
  {
    id: 4,
    title: "주말 브런치 쿠킹 클래스",
    subtitle: "함께 요리하고 다이닝까지 즐기는 시간",
    image: meetingWine,
    location: "성동구",
    price: "70,000원",
    tags: ["#요리", "#브런치", "#취미"],
    time: "매주 일요일 11:00",
    ageGroup: "2030",
    company: "쿠킹메이트",
    isOneTime: false,
    regularDays: ["일"],
  },
  {
    id: 5,
    title: "퇴근 후 독서 모임",
    subtitle: "책 한 권으로 나누는 깊은 대화",
    image: meetingWine,
    location: "마포구",
    price: "20,000원",
    tags: ["#독서", "#자기계발", "#대화"],
    time: "매주 수요일 20:00",
    ageGroup: "2030",
    company: "북살롱",
    isOneTime: false,
    regularDays: ["수", "토"],
  },
  {
    id: 6,
    title: "불금 루프탑 파티 (크리스마스 특집)",
    subtitle: "야경과 함께 즐기는 칵테일 파티",
    image: meetingWine,
    location: "용산구",
    price: "60,000원",
    tags: ["#파티", "#칵테일", "#불금"],
    time: "12월 24일 금요일 21:00",
    ageGroup: "2030",
    company: "파티피플",
    isOneTime: true,
    oneTimeDate: "12.24(금)",
  },
];
