import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { searchDatingGroups, getDatingGroup } from "../api/dating";
import type {
  SearchDatingParams,
  DatingPagingResponse,
} from "../types/dating";

export const datingKeys = {
  all: ["dating"] as const,
  lists: () => [...datingKeys.all, "list"] as const,
  list: (params: SearchDatingParams) =>
    [...datingKeys.lists(), params] as const,
  details: () => [...datingKeys.all, "detail"] as const,
  detail: (id: number) => [...datingKeys.details(), id] as const,
};

/**
 * 소개팅 그룹 무한 스크롤 검색 쿼리
 */
export const useInfiniteSearchDatingGroups = (params: SearchDatingParams) => {
  return useInfiniteQuery({
    queryKey: datingKeys.list(params),
    queryFn: ({ pageParam = 1 }) =>
      searchDatingGroups({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: DatingPagingResponse,
      allPages: DatingPagingResponse[],
    ) => {
      const nextPage = allPages.length + 1;
      const totalCount = lastPage.totalCount;
      const size = params.size || 20;

      // 더 이상 불러올 데이터가 없으면 undefined 반환
      if ((nextPage - 1) * size >= totalCount) {
        return undefined;
      }
      return nextPage;
    },
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
