import api from "./axios";
import type {
  CommonResponse,
  DatingPagingResponse,
  DatingResponse,
  SearchDatingParams,
} from "../types/dating";

/**
 * 소개팅 그룹 검색 API
 * POST /api/datings/search
 */
export const searchDatingGroups = async (
  params: SearchDatingParams,
): Promise<DatingPagingResponse> => {
  const { data } = await api.post<CommonResponse<DatingPagingResponse>>(
    "/datings/search",
    params,
  );

  if (!data.data) {
    throw new Error(data.message || "No data received");
  }

  return data.data;
};

/**
 * 소개팅 그룹 단건 조회 API
 * GET /api/datings/{datingId}
 */
export const getDatingGroup = async (
  datingId: number,
): Promise<DatingResponse> => {
  const { data } = await api.get<CommonResponse<DatingResponse>>(
    `/datings/${datingId}`,
  );

  if (!data.data) {
    throw new Error(data.message || "존재하지 않는 모임입니다.");
  }

  return data.data;
};
