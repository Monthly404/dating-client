# 🎨 소개팅.zip 디자인 시스템

## 1. 개요 (Overview)

'소개팅.zip'은 **Clean, Premium, Trustworthy**를 키워드로 하는 모던한 디자인 언어를 사용합니다. 불필요한 장식을 배제하고 컨텐츠(모임 정보)에 집중할 수 있는 UI를 지향합니다.

---

## 2. 색상 (Colors)

### Primary Palette

- **Primary Text (`--color-primary`)**: `#171719` (깊은 검정)
  - 주요 제목, 본문 텍스트에 사용
- **Secondary Text (`--color-secondary`)**: `#767676` (중간 회색)
  - 부가 설명, 메타 데이터에 사용
- **Tertiary Text (`--color-tertiary`)**: `#999999` (연한 회색)
  - 비활성화된 텍스트, 플레이스홀더에 사용

### Brand Colors

- **Accent (`--color-accent`)**: `#ff385c` (브랜드 핑크)
  - CTA 버튼, 강조 텍스트, 활성화 상태 표시

### Backgrounds

- **Background (`--color-bg`)**: `#f5f6f8` (밝은 회색 배경)
  - 페이지 전체 배경
- **Surface (`--color-surface`)**: `#ffffff` (흰색)
  - 카드, 모달, 헤더 등 컨텐츠 영역 배경
- **Border (`--color-border`)**: `#eaecee` (매우 연한 회색)
  - 구분선, 보더 라인

---

## 3. 타이포그래피 (Typography)

### Font Family

- **Pretendard**: 모든 텍스트에 적용 (시스템 폰트 폴백 지원)
- **Letter Spacing**: `-0.025em` (가독성을 위해 좁게 설정)

### Font Sizes

- **H1 (Large Title)**: 2.5rem (40px)
- **H2 (Section Title)**: 1.5rem (24px)
- **H3 (Card Title)**: 1.15rem ~ 1.25rem
- **Body**: 1rem (16px)
- **Small**: 0.85rem ~ 0.9rem
- **Micro**: 0.75rem (12px) - 태그 및 배지

---

## 4. 레이아웃 및 간격 (Layout & Spacing)

### Spacing System (변수)

| 변수명          | 크기 | 용도                               |
| :-------------- | :--- | :--------------------------------- |
| `--spacing-xs`  | 4px  | 매우 좁은 간격 (태그 내부 등)      |
| `--spacing-sm`  | 8px  | 좁은 간격 (아이콘과 텍스트 사이)   |
| `--spacing-md`  | 16px | 기본 간격 (카드 패딩, 리스트 간격) |
| `--spacing-lg`  | 24px | 넓은 간격 (섹션 내부 여백)         |
| `--spacing-xl`  | 40px | 섹션 간 간격                       |
| `--spacing-xxl` | 80px | 큰 세로 여백                       |

### Container

- **Max Width**: `1140px` (`--container-width`)
- **Center Alignment**: `margin: 0 auto` 적용
- **Responsive Padding**: 모바일에서 좌우 `16px` 여백

---

## 5. UI 요소 스타일 (Components)

### Shadows (그림자)

부드럽고 확산된 그림자를 사용하여 깊이감을 표현합니다.

- **Small (`--shadow-sm`)**: `0 2px 8px rgba(0, 0, 0, 0.04)` (카드 기본)
- **Medium (`--shadow-md`)**: `0 8px 24px rgba(0, 0, 0, 0.06)` (호버 효과)
- **Large (`--shadow-lg`)**: `0 16px 48px rgba(0, 0, 0, 0.08)` (모달, 드롭다운)

### Border Radius

- **Small (`--radius-sm`)**: 8px (버튼, 인풋)
- **Medium (`--radius-md`)**: 16px (카드, 컨테이너)
- **Large (`--radius-lg`)**: 24px (배지, 칩)

### Buttons

- **Primary Button**: Accent Color 배경 + 흰색 텍스트
- **Secondary Button**: Border Color 테두리 + 검정 텍스트
- **States**: `disabled` 상태에서는 회색조 및 클릭 방지 처리

### Cards (MeetingCard)

- **Aspect Ratio**: 이미지는 3:2 비율 유지
- **Hover Effect**: `translateY(-2px)`와 그림자 강화로 인터랙션 피드백 제공
- **Information Hierarchy**: 썸네일 → 제목 → 날짜/가격 → 태그 순서

### Empty States

- 친근한 아이콘 (SVG) 사용
- 중앙 정렬된 레이아웃
- 명확한 메시지와 행동 유도 문구

---

## 6. 반응형 가이드 (Responsive)

- **Mobile First**: 기본 스타일은 모바일 최적화
- **Tablet/Desktop**: `@media (min-width: 768px)` 사용하여 레이아웃 확장
- **Grid System**:
  - 모바일: 1열 (Vertical List)
  - 데스크톱: Grid Layout (`repeat(auto-fill, minmax(280px, 1fr))`)

---

## 7. 접근성 (Accessibility)

- **Contrast**: 텍스트와 배경 간 충분한 대비 확보
- **Interactive Areas**: 버튼 및 링크는 충분한 터치 영역(최소 44px) 확보
- **Semantic HTML**: `section`, `header`, `footer`, `nav` 등 시맨틱 태그 사용 권장
