import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchDatingGroups, getDatingGroup } from "../api/dating";
import type { SearchDatingParams } from "../types/dating";

export const datingKeys = {
  all: ["dating"] as const,
  lists: () => [...datingKeys.all, "list"] as const,
  list: (params: SearchDatingParams) =>
    [...datingKeys.lists(), params] as const,
  details: () => [...datingKeys.all, "detail"] as const,
  detail: (id: number) => [...datingKeys.details(), id] as const,
};

/**
 * 소개팅 그룹 검색 쿼리
 * POST /api/datings/search
 */
export const useSearchDatingGroups = (params: SearchDatingParams) => {
  return useQuery({
    queryKey: datingKeys.list(params),
    queryFn: () => searchDatingGroups(params),
    placeholderData: keepPreviousData,
  });
};

/**
 * 소개팅 그룹 단건 조회 쿼리
 * GET /api/datings/{datingId}
 */
export const useGetDatingGroup = (datingId: number) => {
  return useQuery({
    queryKey: datingKeys.detail(datingId),
    queryFn: () => getDatingGroup(datingId),
    enabled: !!datingId,
  });
};
