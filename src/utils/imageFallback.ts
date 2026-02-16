/**
 * 폴백 이미지 경로 목록
 * public 폴더에 저장된 이미지들입니다.
 */
const FALLBACK_IMAGES = [
  "/fallback-1.png",
  "/fallback-2.png",
  "/fallback-3.png",
];

/**
 * ID를 기반으로 결정적인(deterministic) 폴백 이미지를 반환합니다.
 * ID가 없으면 랜덤하게 반환합니다.
 * @param id 엔티티 ID (선택사항)
 * @returns 폴백 이미지 경로 문자열
 */
export const getFallbackImage = (id?: number): string => {
  if (typeof id !== "number") {
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  }
  // ID가 음수일 경우를 대비해 절대값 사용
  return FALLBACK_IMAGES[Math.abs(id) % FALLBACK_IMAGES.length];
};

/**
 * 이미지 로드 실패 시 폴백 이미지로 대체하는 핸들러
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  id: number,
) => {
  e.currentTarget.src = getFallbackImage(id);
};
