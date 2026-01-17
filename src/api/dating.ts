import api from "./axios";
import type {
  CommonResponse,
  DatingGroupPagingResponse,
  SearchDatingParams,
} from "../types/dating";

export const searchDatingGroups = async (
  params: SearchDatingParams
): Promise<DatingGroupPagingResponse> => {
  const { data } = await api.post<CommonResponse<DatingGroupPagingResponse>>(
    "/dating/search",
    params
  );

  if (!data.data) {
    throw new Error(data.message || "No data received");
  }

  return data.data;
};
