export type FilterType =
  | "REGION_CODE"
  | "DAYS"
  | "APPLY_PERIOD"
  | "SCHEDULE_PERIOD"
  | "TIME_RANGE"
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

// Filter Interfaces
interface BaseFilter {
  type: FilterType;
}

export interface RegionCodeFilter extends BaseFilter {
  type: "REGION_CODE";
  includes: string[];
  excludes: string[];
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
  | RegionCodeFilter
  | DaysFilter
  | ApplyPeriodFilter
  | SchedulePeriodFilter
  | TimeRangeFilter
  | PriceRangeFilter
  | HeadCountFilter
  | EtcFilter;

// Request Response Interfaces
export interface SearchDatingParams {
  filters?: DatingFilterParam[];
  sort?: "RECOMMEND" | "LATEST";
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

export interface VendorProfileResponse {
  id: number;
  name: string;
  thumbnail?: string;
}

export interface DatingResponse {
  id: number;
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
  vendor?: VendorProfileResponse;
}

export interface DatingPagingResponse {
  totalCount: number;
  datings: DatingResponse[];
}

// Legacy type aliases for backward compatibility
export type DatingGroupResponse = DatingResponse;
export type DatingGroupPagingResponse = DatingPagingResponse;

export interface CommonResponse<T> {
  message: string;
  data: T | null;
}
