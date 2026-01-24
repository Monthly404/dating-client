export type FilterType =
  | "DISTRICT"
  | "DAYS"
  | "APPLY_PERIOD"
  | "SCHEDULE_PERIOD"
  | "TIME_RANGE"
  | "AGE_RANGE"
  | "PRICE_RANGE"
  | "HEAD_COUNT"
  | "ETC";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type TimeRange = "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
export type AgeGroup = "TWENTIES" | "THIRTIES" | "ELDER";

// Filter Interfaces
interface BaseFilter {
  type: FilterType;
}

export interface DistrictFilter extends BaseFilter {
  type: "DISTRICT";
  sido: string;
  gugun: string;
}

export interface DaysFilter extends BaseFilter {
  type: "DAYS";
  days: DayOfWeek[];
}

export interface ApplyPeriodFilter extends BaseFilter {
  type: "APPLY_PERIOD";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface SchedulePeriodFilter extends BaseFilter {
  type: "SCHEDULE_PERIOD";
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface TimeRangeFilter extends BaseFilter {
  type: "TIME_RANGE";
  timeRanges: TimeRange[];
}

export interface AgeRangeFilter extends BaseFilter {
  type: "AGE_RANGE";
  ageGroups: AgeGroup[];
}

export interface PriceRangeFilter extends BaseFilter {
  type: "PRICE_RANGE";
  minPrice?: number;
  maxPrice?: number;
}

export interface HeadCountFilter extends BaseFilter {
  type: "HEAD_COUNT";
  count: number;
}

export interface EtcFilter extends BaseFilter {
  type: "ETC";
  tagType: string;
  value?: string;
}

export type DatingFilterParam =
  | DistrictFilter
  | DaysFilter
  | ApplyPeriodFilter
  | SchedulePeriodFilter
  | TimeRangeFilter
  | AgeRangeFilter
  | PriceRangeFilter
  | HeadCountFilter
  | EtcFilter;

// Request Response Interfaces
export interface SearchDatingParams {
  filters?: DatingFilterParam[];
  page?: number;
  size?: number;
}

export interface AddressResponse {
  sido: string;
  gugun: string;
  dong: string;
  road: string;
  detail: string;
  latitude: number;
  longitude: number;
}

export interface PeriodResponse {
  start: string; // LocalDateTime
  end: string; // LocalDateTime
}

export interface RepeatScheduleResponse {
  day: DayOfWeek;
  time: string; // LocalTime
}

export interface DatingScheduleResponse {
  type: "INSTANT" | "REPEAT";
  schedules?: string[]; // LocalDateTime[]
  repeatSchedules?: RepeatScheduleResponse[];
}

export interface TagResponse {
  type: string;
  value?: string;
}

export interface DatingGroupResponse {
  name: string;
  thumbnail?: string;
  link?: string;
  address?: AddressResponse;
  apply?: PeriodResponse;
  schedule?: DatingScheduleResponse;
  price?: number;
  ageRange?: number[];
  headCount?: number;
  tags?: TagResponse[];
}

export interface DatingGroupPagingResponse {
  totalCount: number;
  datings: DatingGroupResponse[];
}

export interface CommonResponse<T> {
  message: string;
  data: T | null;
}
