# Dating API 문서

## POST /api/dating/search

소개팅 그룹을 검색하고 필터링하는 API입니다.

### 기본 정보

- **URL**: `/api/dating/search`
- **Method**: `POST`
- **Content-Type**: `application/json`

---

## Request

### Request Body

| 필드    | 타입                      | 필수 여부 | 설명                                 |
| ------- | ------------------------- | --------- | ------------------------------------ |
| filters | `List<DatingFilterParam>` | 선택      | 검색 필터 목록 (여러 필터 조합 가능) |
| page    | `Integer`                 | 선택      | 페이지 번호 (0부터 시작)             |
| size    | `Integer`                 | 선택      | 페이지 당 항목 수                    |

### 필터 타입

모든 필터는 `type` 필드를 포함하며, 각 타입별로 추가 파라미터가 필요합니다.

#### 1. DISTRICT - 지역 필터

특정 시/도와 구/군으로 지역을 필터링합니다.

**파라미터:**

- `sido` (String, 필수): 시/도 (예: "서울특별시")
- `gugun` (String, 필수): 구/군 (예: "강남구")

**유효성 검증:**

- `sido`와 `gugun`은 빈 문자열이 아니어야 합니다.

**예제:**

```json
{
  "type": "DISTRICT",
  "sido": "서울특별시",
  "gugun": "강남구"
}
```

#### 2. DAYS - 요일 필터

특정 요일에 열리는 모임을 필터링합니다.

**파라미터:**

- `days` (List<DayOfWeek>, 필수): 요일 목록

**유효성 검증:**

- `days` 리스트는 비어있지 않아야 합니다.

**가능한 요일 값:**
`MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`

**예제:**

```json
{
  "type": "DAYS",
  "days": ["FRIDAY", "SATURDAY"]
}
```

#### 3. APPLY_PERIOD - 신청 기간 필터

특정 날짜 범위 내에 신청이 가능한 모임을 필터링합니다.

**파라미터:**

- `startDate` (LocalDate, 필수): 시작 날짜 (형식: YYYY-MM-DD)
- `endDate` (LocalDate, 필수): 종료 날짜 (형식: YYYY-MM-DD)

**유효성 검증:**

- `startDate`는 `endDate`보다 이전이거나 같아야 합니다.

**예제:**

```json
{
  "type": "APPLY_PERIOD",
  "startDate": "2026-01-10",
  "endDate": "2026-01-20"
}
```

#### 4. SCHEDULE_PERIOD - 오픈 기간 필터

특정 날짜 범위 내에 오픈되는 모임을 필터링합니다.

**파라미터:**

- `startDate` (LocalDate, 필수): 시작 날짜 (형식: YYYY-MM-DD)
- `endDate` (LocalDate, 필수): 종료 날짜 (형식: YYYY-MM-DD)

**유효성 검증:**

- `startDate`는 `endDate`보다 이전이거나 같아야 합니다.

**예제:**

```json
{
  "type": "SCHEDULE_PERIOD",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28"
}
```

#### 5. TIME_RANGE - 시간대 필터

특정 시간대에 열리는 모임을 필터링합니다.

**파라미터:**

- `timeRanges` (List<String>, 필수): 시간대 목록

**가능한 시간대 값:**

- `MORNING` - 오전
- `AFTERNOON` - 오후
- `EVENING` - 저녁
- `NIGHT` - 밤

**예제:**

```json
{
  "type": "TIME_RANGE",
  "timeRanges": ["EVENING", "NIGHT"]
}
```

#### 6. AGE_RANGE - 나이대 필터

특정 나이대의 모임을 필터링합니다.

**파라미터:**

- `ageGroups` (List<String>, 필수): 나이대 목록

**가능한 나이대 값:**

- `TWENTIES` - 20대
- `THIRTIES` - 30대
- `ELDER` - 40대 이상

**예제:**

```json
{
  "type": "AGE_RANGE",
  "ageGroups": ["TWENTIES", "THIRTIES"]
}
```

#### 7. PRICE_RANGE - 가격 범위 필터

특정 가격 범위 내의 모임을 필터링합니다.

**파라미터:**

- `minPrice` (Integer, 선택): 최소 가격 (기본값: 0)
- `maxPrice` (Integer, 선택): 최대 가격 (기본값: Integer.MAX_VALUE)

**유효성 검증:**

- `minPrice`는 `maxPrice`보다 작아야 합니다.

**예제:**

```json
{
  "type": "PRICE_RANGE",
  "minPrice": 50000,
  "maxPrice": 100000
}
```

#### 8. HEAD_COUNT - 인원수 필터

특정 인원수의 모임을 필터링합니다.

**파라미터:**

- `count` (Integer, 필수): 인원수

**유효성 검증:**

- `count`는 0보다 커야 합니다.

**예제:**

```json
{
  "type": "HEAD_COUNT",
  "count": 10
}
```

#### 9. ETC - 기타 필터

태그 타입과 값으로 모임을 필터링합니다. (지자체/사설, 컨셉, 애프터파티 등)

**파라미터:**

- `tagType` (String, 필수): 태그 타입
- `value` (String, 선택): 태그 값

**예제:**

```json
{
  "type": "ETC",
  "tagType": "CONCEPT",
  "value": "와인파티"
}
```

---

## Response

### 성공 응답 (200 OK)

모든 응답은 `CommonResponse` 래퍼로 감싸져 반환됩니다.

**CommonResponse 구조:**

```json
{
  "message": "성공",
  "data": {
    /* 실제 데이터 */
  }
}
```

**DatingGroupPagingResponse 구조:**

| 필드         | 타입                        | 설명              |
| ------------ | --------------------------- | ----------------- |
| totalCount   | `Integer`                   | 전체 검색 결과 수 |
| datingGroups | `List<DatingGroupResponse>` | 소개팅 그룹 목록  |

**DatingResponse 필드:**

| 필드      | 타입                     | 설명                         |
| --------- | ------------------------ | ---------------------------- |
| name      | `String`                 | 모임 이름                    |
| thumbnail | `String`                 | 썸네일 이미지 URL (nullable) |
| link      | `String`                 | 상세 정보 링크 (nullable)    |
| address   | `AddressResponse`        | 주소 정보 (nullable)         |
| apply     | `PeriodResponse`         | 신청 기간 (nullable)         |
| schedule  | `DatingScheduleResponse` | 일정 정보 (nullable)         |
| price     | `Integer`                | 참가 비용 (nullable)         |
| ageRange  | `List<Integer>`          | 연령대 범위 (nullable)       |
| headCount | `Integer`                | 모집 인원 (nullable)         |
| tags      | `List<TagResponse>`      | 태그 목록                    |

**AddressResponse 필드:**

| 필드      | 타입     | 설명      |
| --------- | -------- | --------- |
| sido      | `String` | 시/도     |
| gugun     | `String` | 구/군     |
| dong      | `String` | 동        |
| road      | `String` | 도로명    |
| detail    | `String` | 상세 주소 |
| latitude  | `Double` | 위도      |
| longitude | `Double` | 경도      |

**PeriodResponse 필드:**

| 필드  | 타입            | 설명      |
| ----- | --------------- | --------- |
| start | `LocalDateTime` | 시작 일시 |
| end   | `LocalDateTime` | 종료 일시 |

**DatingScheduleResponse 필드:**

| 필드            | 타입                           | 설명                                 |
| --------------- | ------------------------------ | ------------------------------------ |
| type            | `String`                       | 일정 타입 (`INSTANT` 또는 `REPEAT`)  |
| schedules       | `List<LocalDateTime>`          | 즉석 일정 목록 (type=INSTANT인 경우) |
| repeatSchedules | `List<RepeatScheduleResponse>` | 반복 일정 목록 (type=REPEAT인 경우)  |

**RepeatScheduleResponse 필드:**

| 필드 | 타입        | 설명 |
| ---- | ----------- | ---- |
| day  | `DayOfWeek` | 요일 |
| time | `LocalTime` | 시간 |

**TagResponse 필드:**

| 필드  | 타입     | 설명               |
| ----- | -------- | ------------------ |
| type  | `String` | 태그 타입          |
| value | `String` | 태그 값 (nullable) |

### 성공 응답 예제

```json
{
  "message": "성공",
  "data": {
    "totalCount": 42,
    "datingGroups": [
      {
        "name": "강남 와인 소개팅",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "link": "https://example.com/dating/123",
        "address": {
          "sido": "서울특별시",
          "gugun": "강남구",
          "dong": "역삼동",
          "road": "테헤란로",
          "detail": "123번지",
          "latitude": 37.5012,
          "longitude": 127.0396
        },
        "apply": {
          "start": "2026-01-10T00:00:00",
          "end": "2026-01-20T23:59:59"
        },
        "schedule": {
          "type": "INSTANT",
          "schedules": ["2026-01-25T19:00:00", "2026-02-01T19:00:00"],
          "repeatSchedules": null
        },
        "price": 80000,
        "ageRange": [25, 35],
        "headCount": 20,
        "tags": [
          {
            "type": "CONCEPT",
            "value": "와인파티"
          },
          {
            "type": "ORGANIZER",
            "value": "사설"
          }
        ]
      },
      {
        "name": "주말 등산 소개팅",
        "thumbnail": null,
        "link": "https://example.com/dating/456",
        "address": {
          "sido": "경기도",
          "gugun": "수원시",
          "dong": "팔달구",
          "road": "효원로",
          "detail": "456번지",
          "latitude": 37.2636,
          "longitude": 127.0286
        },
        "apply": {
          "start": "2026-01-15T00:00:00",
          "end": "2026-01-31T23:59:59"
        },
        "schedule": {
          "type": "REPEAT",
          "schedules": null,
          "repeatSchedules": [
            {
              "day": "SATURDAY",
              "time": "09:00:00"
            },
            {
              "day": "SUNDAY",
              "time": "09:00:00"
            }
          ]
        },
        "price": 30000,
        "ageRange": [20, 40],
        "headCount": 10,
        "tags": [
          {
            "type": "CONCEPT",
            "value": "등산"
          },
          {
            "type": "ORGANIZER",
            "value": "지자체"
          }
        ]
      }
    ]
  }
}
```

---

## 에러 응답

에러 발생 시 `CommonResponse`의 `message` 필드에 에러 메시지가 포함되며, `data`는 `null`이 됩니다.

**에러 응답 구조:**

```json
{
  "message": "에러 메시지",
  "data": null
}
```

**가능한 에러 케이스:**

- 잘못된 필터 파라미터 (유효성 검증 실패)
- 잘못된 날짜 형식
- 잘못된 요청 형식

**에러 응답 예제:**

```json
{
  "message": "필터 파라미터가 유효하지 않습니다",
  "data": null
}
```

---

## 전체 사용 예제

### 요청 예제: 여러 필터 조합

강남구에서, 금요일 또는 토요일에, 5만원~10만원 사이의 모임을 검색하는 예제입니다.

```bash
POST /api/dating/search
Content-Type: application/json

{
  "filters": [
    {
      "type": "DISTRICT",
      "sido": "서울특별시",
      "gugun": "강남구"
    },
    {
      "type": "DAYS",
      "days": ["FRIDAY", "SATURDAY"]
    },
    {
      "type": "PRICE_RANGE",
      "minPrice": 50000,
      "maxPrice": 100000
    }
  ],
  "page": 1,
  "size": 10
}
```

### 요청 예제: 필터 없이 전체 조회

```bash
POST /api/dating/search
Content-Type: application/json

{
  "filters": null,
  "page": 1,
  "size": 20
}
```

또는 빈 본문으로 요청:

```bash
POST /api/dating/search
Content-Type: application/json

{
  "filters": [],
  "page": 1,
  "size": 20
}
```

### 요청 예제: 시간대와 나이대 필터

저녁 또는 밤 시간대에 열리며, 20대 또는 30대를 위한 모임을 검색하는 예제입니다.

```bash
POST /api/dating/search
Content-Type: application/json

{
  "filters": [
    {
      "type": "TIME_RANGE",
      "timeRanges": ["EVENING", "NIGHT"]
    },
    {
      "type": "AGE_RANGE",
      "ageGroups": ["TWENTIES", "THIRTIES"]
    }
  ],
  "page": 1,
  "size": 10
}
```
