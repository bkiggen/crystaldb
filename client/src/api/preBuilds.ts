import type { PreBuildT } from "../types/PreBuild"
import { makeRestRequest } from "./makeRequest"
import type { PagingT } from "../types/Paging"

export const createPreBuild = async (newPreBuild: Omit<PreBuildT, "id">): Promise<PreBuildT> => {
  const endpoint = "/preBuilds"
  return makeRestRequest<PreBuildT>(endpoint, "POST", JSON.stringify(newPreBuild))
}

export const getAllPreBuilds = async ({
  searchTerm = "",
  page = 1,
  pageSize = 100,
  subscriptionId,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
  subscriptionId?: string
}): Promise<{ data: PreBuildT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    ...(subscriptionId ? { subscriptionId } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
  }).toString()

  return makeRestRequest<{ data: PreBuildT[]; paging: PagingT }>(`/preBuilds?${query}`, "GET")
}

export const updatePreBuild = async (updatedPreBuild: PreBuildT): Promise<PreBuildT> => {
  const endpoint = `/preBuilds/${updatedPreBuild.id}`
  return makeRestRequest<PreBuildT>(endpoint, "PUT", JSON.stringify(updatedPreBuild))
}
