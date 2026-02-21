# Frip → 소개팅집 Admin 모임 등록 작업 가이드

> 이 문서는 https://www.frip.co.kr/category/gathering/meetingandblinddate?page=4 의 소개팅 상품들을
> https://admin.sogaeting.zip/ 어드민에 등록하는 전체 워크플로우와 기술 패턴을 담고 있습니다.
> Claude in Chrome (MCP 브라우저 자동화)를 사용하는 AI 에이전트를 위한 가이드입니다.

---

# Part 1. 설명

## 1. 전체 워크플로우

```
frip 컬렉션 페이지에서 상품 목록 확인
→ 각 상품 페이지 방문
→ 소개팅 여부 판단 (아니면 스킵)
→ 호스트명(업체명) 추출
→ admin /vendors 페이지에서 업체 등록 여부 확인 (⚠️ 반드시 업체 관리 페이지에서 확인)
→ 미등록이면 업체 먼저 생성 (/vendors/new)
→ 모임 등록 (/datings/new)
→ 다음 상품으로
→ 만약 등록할 업체가 없으면(즉, 등록 대상이 없는 경우) frip의 다음 페이지로 이동
```

### ⚠️ 업체 검색 시 주의사항

업체 존재 여부는 **반드시 `/vendors` 페이지**에서 확인해야 한다.

- 모임 관리 목록(`/`)에서 검색하면 **모임명에 업체명이 포함되지 않는 경우** 놓칠 수 있음
- `/vendors` 페이지에서 page size를 100으로 변경 후, 테이블 row에서 텍스트 검색
- **띄어쓰기 구분 없이** 검색 (예: "핫 브릿지" → "핫브릿지"도 매칭)

```javascript
// 업체 검색 패턴 (vendors 페이지에서)
const pageSizeSelect = document.querySelector("select");
const nativeSelectSetter = Object.getOwnPropertyDescriptor(
  window.HTMLSelectElement.prototype,
  "value",
).set;
nativeSelectSetter.call(pageSizeSelect, "100");
pageSizeSelect.dispatchEvent(new Event("change", { bubbles: true }));

// 1초 대기 후
const rows = document.querySelectorAll("tr");
let found = [];
rows.forEach((r) => {
  const text = r.textContent.replace(/\s/g, "");
  if (text.includes("검색어".replace(/\s/g, ""))) {
    found.push(r.textContent.trim().substring(0, 80));
  }
});
found.length > 0 ? found.join("|") : "VENDOR_NOT_FOUND";
```

---

## 2. 필터링 규칙 (스킵 기준)

### 소개팅 상품 키워드 (등록 대상)

- "소개팅", "로테이션", "파티", "시그널", "썸", "커플", "미팅", "매칭"

### 스킵 키워드

- "캐주얼 모임", "원데이 클래스", "드로잉 살롱", "러닝", "네트워킹"
- 남녀 만남이 주목적이 아닌 것

### 지역 스킵

- **서울 외 지역은 스킵**: 대구, 부산, 인천, 동탄, 수원 등
- 단, 서울+타지역 동시 운영이면 서울 일정만 등록
- 타이틀에 `[대구]`, `[부산]`, `[동탄]`, `[인천]` 등이 붙어 있으면 스킵

### 기타 스킵

- 이미 등록된 업체

---

## 3. Frip 페이지 정보 추출 방법

### 3-0. 호스트명(업체명) 추출

프립 페이지에서 호스트명은 보통 **"라뷰라뷰" 섹션** 근처에 있다.
"프립 N | 후기 N | 찜 N" 텍스트 바로 앞에 호스트명이 표시된다.

```javascript
const allText = document.body.innerText;
const idx = allText.indexOf("라뷰라뷰");
// 또는 "프립 1" "프립 N" 패턴 근처에서 추출
const nearReview =
  idx > -1 ? allText.substring(Math.max(0, idx - 200), idx + 100) : "not found";
```

> 호스트명이 텍스트로 추출 안 되면 스크린샷으로 시각적 확인

### 3-1. 모임명 규칙

| 상황                           | 규칙                                       |
| ------------------------------ | ------------------------------------------ |
| 업체에 모임이 **1개뿐**        | 지역명 생략, frip 타이틀을 주로 참고       |
| 업체에 모임이 **여러 개**      | 지역명 붙임 (예: "[강남] 로테이션 소개팅") |
| 지역/컨셉/음주여부가 다른 경우 | 모임 별도 등록                             |

- 모임 제목은 **프립 상세 타이틀에 기반**해서 정한다
- 이모지, 날짜 정보, "급구" 등 임시 문구는 제거

### 3-2. 가격

- 프립 타이틀 아래 나와있는 **최저 가격** 기준으로 입력
- 할인가가 표시되어 있으면 할인된 가격 사용

### 3-3. 인원

- **최대 인원** 기준으로 입력 (남은 인원이 아님!)
- 로테이션 소개팅: **한쪽 인원 수** 입력 (예: 8:8이면 8)
- 파티형: **전체 인원** (예: 최대 72명이면 72)
- 1:1 소개팅: 1
- 상세 설명에서 "정원은 최소 N명에서 최대 N명" 확인
- **온라인 모임일 경우 모집 인원은 비워둔다**

### 3-4. 나이

- 프립 상세에서 "00년생~00년생" 또는 나이 범위 확인
- 계산: **2025 - 출생년도** (2025년 기준)
- 예: "88~95년생" → 30~37세
- 약식 표기:
- "2535" → 25~35세
- "3040" → 30~40세 (주의: "3040"이 30~49가 아닌 경우도 있으니 상세 확인)
- "2030" → 20~39세 (정확한 정보 없을 경우)
- "20중반~30중반" → 29~39세

### 3-5. 일정

- 프립 상세에서 "금요일 19:30", "토요일 19:00" 등 확인
- "참여하기" 버튼의 옵션에서도 일정/가격 확인 가능
- 업체당 최대 3개 일정 등록
- 요일 값: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY

### 3-6. 태그 선택 기준

| 조건                   | 태그          |
| ---------------------- | ------------- |
| 와인/맥주 등 주류 포함 | 음주여부/와인 |
| 로테이션 방식 소개팅   | 컨셉/로테이션 |
| 1:1 소개팅             | 컨셉/1:1      |
| 파티형 소개팅          | 컨셉/파티     |
| 온라인 소개팅          | 온라인 여부   |

> 컨셉 태그(로테이션/1:1/파티)는 셋 중 하나만 선택.
> 음주 태그는 컨셉 태그와 함께 사용 가능.
> "포함 사항"에 주류/와인/맥주/소주 등이 있으면 음주여부/와인 태그 추가

### 3-7. 장소 (상세 주소)

- 항상 필수 입력
- 역이 장소인 경우: "OO역 근처" (예: "강남역 근처")
- 건물이면: 건물명 또는 층/호수 입력 (예: "3층 302호 (비윗미)")

---

# Part 2. 기술 구현 (코드 패턴)

## 1. React Controlled Input 값 설정

이 어드민은 React로 만들어져 있어 일반 value 설정만으로는 state가 반영되지 않는다.
**nativeSetter + dispatchEvent + \_\_reactProps.onChange** 세 가지를 모두 호출해야 한다.

```javascript
// 기본 셋업 (매 페이지 진입 시)
window.alert = function (msg) {
  console.log("ALERT:", msg);
  return true;
};
window.confirm = function (msg) {
  console.log("CONFIRM:", msg);
  return true;
};

const nativeSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value",
).set;
const nativeSelectSetter = Object.getOwnPropertyDescriptor(
  window.HTMLSelectElement.prototype,
  "value",
).set;
```

### text input 설정

```javascript
function setInputValue(name, value) {
  const input = document.querySelector('input[name="' + name + '"]');
  const rpk = Object.keys(input).find((k) => k.startsWith("__reactProps"));
  nativeSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  if (rpk && input[rpk].onChange) {
    input[rpk].onChange({ target: { name: name, value: value } });
  }
}
```

### readOnly 필드 (address.detail, time input)

```javascript
const detailInput = document.querySelector('input[name="address.detail"]');
const dpk = Object.keys(detailInput).find((k) => k.startsWith("__reactProps"));
nativeSetter.call(detailInput, "강남역 근처");
detailInput.dispatchEvent(new Event("input", { bubbles: true }));
detailInput.dispatchEvent(new Event("change", { bubbles: true }));
if (dpk && detailInput[dpk].onChange) {
  detailInput[dpk].onChange({
    target: { name: "address.detail", value: "강남역 근처" },
  });
}
```

### select 설정

```javascript
const vendorSelect = document.querySelector("select");
nativeSelectSetter.call(vendorSelect, "VENDOR_ID");
vendorSelect.dispatchEvent(new Event("change", { bubbles: true }));
```

---

## 2. 업체 생성 (/vendors/new)

```javascript
window.alert = function (msg) {
  console.log("ALERT:", msg);
  return true;
};
window.confirm = function (msg) {
  console.log("CONFIRM:", msg);
  return true;
};
const nativeSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value",
).set;
const nameInput = document.querySelector("input");
nativeSetter.call(nameInput, "업체명");
nameInput.dispatchEvent(new Event("input", { bubbles: true }));
nameInput.dispatchEvent(new Event("change", { bubbles: true }));
const submitBtn = Array.from(document.querySelectorAll("button")).find((b) =>
  b.textContent.includes("업체 생성"),
);
if (submitBtn) submitBtn.click();
```

---

## 3. 모임 등록 (/datings/new) - 전체 흐름

### Step 1: 기본 정보 입력

```javascript
window.alert = function (msg) {
  console.log("ALERT:", msg);
  return true;
};
window.confirm = function (msg) {
  console.log("CONFIRM:", msg);
  return true;
};

const nativeSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value",
).set;
const nativeSelectSetter = Object.getOwnPropertyDescriptor(
  window.HTMLSelectElement.prototype,
  "value",
).set;

// 모임명
const nameInput = document.querySelector(
  'input[placeholder*="주말 러닝 크루"]',
);
nativeSetter.call(nameInput, "모임명");
nameInput.dispatchEvent(new Event("input", { bubbles: true }));
nameInput.dispatchEvent(new Event("change", { bubbles: true }));

// 링크
const linkInput = document.querySelector('input[placeholder*="https://"]');
nativeSetter.call(linkInput, "https://www.frip.co.kr/products/XXXXX");
linkInput.dispatchEvent(new Event("input", { bubbles: true }));
linkInput.dispatchEvent(new Event("change", { bubbles: true }));

// 업체 선택
const vendorSelect = document.querySelector("select");
nativeSelectSetter.call(vendorSelect, "VENDOR_ID");
vendorSelect.dispatchEvent(new Event("change", { bubbles: true }));
```

### Step 2: 주소 검색 (Daum Postcode 모달)

이 모달은 중첩 iframe 구조로 되어 있어 JavaScript로 내부 DOM 접근이 어렵다.
**스크린샷을 찍고 결과 행의 좌표를 직접 클릭**해야 한다.

```
[흐름]
1. "주소 검색" 버튼 클릭
2. 모달 로드 대기 (약 1-2초)
3. 검색창 클릭 (viewport 기준 약 x=740, y=278)
4. 주소 텍스트 입력 (예: "강남대로 396")
5. Enter 키
6. 검색 결과 대기 (약 1-2초) + 스크린샷 확인
7. "지 번" 뱃지가 붙은 행을 클릭 (도로명 행 금지!)
- 일반적으로 좌표: (638, 364) 부근
8. 모달 자동 닫힘 + 주소/좌표 자동 입력 확인
```

> ⚠️ **반드시 "지번" 행을 클릭**해야 한다. 도로명 행을 클릭하면 주소가 제대로 입력되지 않을 수 있다.

### Step 3: 상세 주소 + 숫자 필드 입력

```javascript
// 상세 주소 (readOnly 필드)
const detailInput = document.querySelector('input[name="address.detail"]');
const dpk = Object.keys(detailInput).find((k) => k.startsWith("__reactProps"));
nativeSetter.call(detailInput, "강남역 근처");
detailInput.dispatchEvent(new Event("input", { bubbles: true }));
detailInput.dispatchEvent(new Event("change", { bubbles: true }));
if (dpk && detailInput[dpk].onChange) {
  detailInput[dpk].onChange({
    target: { name: "address.detail", value: "강남역 근처" },
  });
}

// 숫자 필드들
function setInputValue(name, value) {
  const input = document.querySelector('input[name="' + name + '"]');
  const rpk = Object.keys(input).find((k) => k.startsWith("__reactProps"));
  nativeSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  if (rpk && input[rpk].onChange) {
    input[rpk].onChange({ target: { name: name, value: value } });
  }
}

setInputValue("headCount", "8");
setInputValue("price", "35000");
setInputValue("minAge", "25");
setInputValue("maxAge", "35");
```

### Step 4: 일정 + 태그 설정 (통합 패턴)

일정과 태그는 setTimeout 체이닝으로 설정한다. DOM이 비동기로 업데이트되기 때문.

```javascript
const nativeSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value",
).set;
const nativeSelectSetter = Object.getOwnPropertyDescriptor(
  window.HTMLSelectElement.prototype,
  "value",
).set;

// 일정 추가
const addScheduleBtn = Array.from(document.querySelectorAll("button")).find(
  (b) => b.textContent.includes("일정 추가"),
);
addScheduleBtn.click();

setTimeout(() => {
  // 요일 선택
  const daySelects = Array.from(document.querySelectorAll("select")).filter(
    (s) => Array.from(s.options).some((o) => o.value === "FRIDAY"),
  );
  nativeSelectSetter.call(daySelects[0], "SATURDAY");
  daySelects[0].dispatchEvent(new Event("change", { bubbles: true }));

  // 시간 설정
  const timeInputs = Array.from(
    document.querySelectorAll('input[type="time"]'),
  );
  const pk = Object.keys(timeInputs[0]).find((k) =>
    k.startsWith("__reactProps"),
  );
  nativeSetter.call(timeInputs[0], "18:00");
  timeInputs[0].dispatchEvent(new Event("input", { bubbles: true }));
  timeInputs[0].dispatchEvent(new Event("change", { bubbles: true }));
  if (pk && timeInputs[0][pk].onChange) {
    timeInputs[0][pk].onChange({
      target: { name: timeInputs[0].name, value: "18:00" },
    });
  }

  // 두 번째 일정이 필요하면 addScheduleBtn.click() 후 setTimeout으로 체이닝

  // 태그 추가 (컨셉)
  const tagBtn = Array.from(document.querySelectorAll("button")).find((b) =>
    b.textContent.includes("태그 추가"),
  );
  tagBtn.click();
  setTimeout(() => {
    const tagSelects = Array.from(document.querySelectorAll("select")).filter(
      (s) => Array.from(s.options).some((o) => o.value === "CONCEPT"),
    );
    nativeSelectSetter.call(tagSelects[0], "CONCEPT");
    tagSelects[0].dispatchEvent(new Event("change", { bubbles: true }));

    const tagInputs = Array.from(document.querySelectorAll("input")).filter(
      (i) =>
        i.placeholder &&
        (i.placeholder.includes("등산") || i.placeholder.includes("주종")),
    );
    const tpk = Object.keys(tagInputs[0]).find((k) =>
      k.startsWith("__reactProps"),
    );
    nativeSetter.call(tagInputs[0], "로테이션");
    tagInputs[0].dispatchEvent(new Event("input", { bubbles: true }));
    tagInputs[0].dispatchEvent(new Event("change", { bubbles: true }));
    if (tpk && tagInputs[0][tpk].onChange) {
      tagInputs[0][tpk].onChange({ target: { value: "로테이션" } });
    }

    // 두 번째 태그 (음주여부) - 필요 시
    tagBtn.click();
    setTimeout(() => {
      const tagSelects2 = Array.from(
        document.querySelectorAll("select"),
      ).filter((s) => Array.from(s.options).some((o) => o.value === "CONCEPT"));
      // 두 번째 태그 select는 index [1]
      nativeSelectSetter.call(tagSelects2[1], "ALCOHOL");
      tagSelects2[1].dispatchEvent(new Event("change", { bubbles: true }));

      const tagInputs2 = Array.from(document.querySelectorAll("input")).filter(
        (i) =>
          i.placeholder &&
          (i.placeholder.includes("등산") || i.placeholder.includes("주종")),
      );
      const tpk2 = Object.keys(tagInputs2[1]).find((k) =>
        k.startsWith("__reactProps"),
      );
      nativeSetter.call(tagInputs2[1], "와인");
      tagInputs2[1].dispatchEvent(new Event("input", { bubbles: true }));
      tagInputs2[1].dispatchEvent(new Event("change", { bubbles: true }));
      if (tpk2 && tagInputs2[1][tpk2].onChange) {
        tagInputs2[1][tpk2].onChange({ target: { value: "와인" } });
      }
    }, 300);
  }, 300);
}, 300);
```

### Step 5: 제출

```javascript
// ⚠️ 제출 전 반드시 alert/confirm override 확인
window.alert = function (msg) {
  console.log("ALERT:", msg);
  return true;
};
window.confirm = function (msg) {
  console.log("CONFIRM:", msg);
  return true;
};

// 스크롤 후 "모임 그룹 생성하기" 버튼 클릭
const submitBtn = Array.from(document.querySelectorAll("button")).find((b) =>
  b.textContent.includes("모임 그룹 생성하기"),
);
if (submitBtn) submitBtn.click();
```

---

## 4. 위경도 수동 설정 (Daum Postcode에서 자동 입력 실패 시)

Daum Postcode 모달에서 주소 선택 후에도 lat/lng가 비어있는 경우가 있다.
이때 수동으로 좌표를 설정해야 한다.

```javascript
function setReactInput(name, value) {
  const input = document.querySelector('input[name="' + name + '"]');
  const rpk = Object.keys(input).find((k) => k.startsWith("__reactProps"));
  nativeSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  if (rpk && input[rpk].onChange) {
    input[rpk].onChange({ target: { name: name, value: value } });
  }
}

setReactInput("address.lat", "37.5563");
setReactInput("address.lng", "126.9368");
```

### 주요 지역 좌표 참고

| 지역       | 위도 (lat) | 경도 (lng) |
| ---------- | ---------- | ---------- |
| 강남역     | 37.49988   | 127.03856  |
| 합정역     | 37.5571    | 126.9262   |
| 홍대입구역 | 37.5571    | 126.9244   |
| 청담역     | 37.5198    | 127.0474   |
| 압구정     | 37.5270    | 127.0286   |
| 잠실       | 37.5133    | 127.1002   |
| 삼성역     | 37.5088    | 127.0631   |

---

## 5. 트러블슈팅

### 제출 시 "모든 주소 정보 입력 필요" 알림

→ address.detail이 비어있음. 상세 주소를 반드시 입력할 것.
→ 또는 lat/lng가 비어있음. 수동 좌표 설정 필요.

### FormData body가 `{"dating":{}}` 로 비어 있음

→ React state가 반영되지 않은 것.
→ **nativeSetter + dispatchEvent + \_\_reactProps.onChange** 세 가지를 모두 호출해야 함.

### 주소 모달에서 클릭이 반응 없음

→ 중첩 iframe 구조. 좌표를 달리하며 재시도.
→ "지번" 행 좌표를 스크린샷으로 확인 후 정확히 클릭.

### alert/confirm 팝업으로 제출이 블록됨

→ 제출 버튼 클릭 전에 반드시 window.alert과 window.confirm을 override.
→ **모든 JS 실행 블록 시작 시** override를 포함하는 것이 안전.

### 업체 중복 생성

→ `/vendors` 페이지에서 검색하지 않고 모임 목록(`/`)에서 검색하면 놓칠 수 있음.
→ 반드시 업체 관리 페이지에서 page size 100으로 변경 후 검색.

### Frip 상세 정보가 이미지로 되어 있음

→ 텍스트 추출 불가. 스크린샷을 통해 시각적으로 확인.
→ "참여하기" 버튼의 옵션에서 가격/일정 정보 확인 가능.

---

## 6. 등록 완료 후 확인

- 제출 후 `/` (모임 관리 목록)으로 자동 이동됨
- 상단에 방금 등록한 모임이 가장 높은 ID로 표시됨
- ID와 이름, 주소가 올바르게 입력됐는지 확인

---

# Part 3. 실전 체크리스트

## 모임 등록 전 체크리스트

- [ ] 소개팅 상품인가? (필터링 규칙 확인)
- [ ] 서울 지역인가?
- [ ] 업체가 `/vendors` 페이지에 이미 존재하는가?
- [ ] 동일한 모임이 이미 등록되어 있지 않은가?

## 폼 입력 체크리스트

- [ ] 모임명: 프립 타이틀 기반
- [ ] 링크: frip 상품 URL
- [ ] 업체: 올바른 vendor ID 선택
- [ ] 주소: Daum Postcode로 검색 → **지번** 행 클릭
- [ ] 상세 주소: "OO역 근처" 또는 건물명
- [ ] 위도/경도: 자동 입력 확인 (비어있으면 수동 설정)
- [ ] 인원: **최대 인원** 기준 (로테이션=한쪽, 파티=전체, 1:1=1)
- [ ] 가격: **최저 가격** 기준
- [ ] 나이: 상세 페이지에서 확인 (2025 - 출생년도)
- [ ] 일정: 요일 + 시작 시간 (최대 3개)
- [ ] 태그: 컨셉(1개) + 음주여부(선택)
- [ ] alert/confirm override 설정 확인
