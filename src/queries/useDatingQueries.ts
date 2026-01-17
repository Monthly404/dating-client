import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchDatingGroups } from "../api/dating";
import type { SearchDatingParams } from "../types/dating";

export const datingKeys = {
  all: ["dating"] as const,
  lists: () => [...datingKeys.all, "list"] as const,
  list: (params: SearchDatingParams) =>
    [...datingKeys.lists(), params] as const,
};

export const useSearchDatingGroups = (params: SearchDatingParams) => {
  return useQuery({
    queryKey: datingKeys.list(params),
    queryFn: () => searchDatingGroups(params),
    placeholderData: keepPreviousData,
  });
};
