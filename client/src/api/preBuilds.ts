import type { PreBuildT } from "../types/PreBuild"
import { makeRestRequest } from "./makeRequest"
import type { PagingT } from "../types/Paging"

export const createPreBuildRequest = async (
  newPreBuild: Omit<PreBuildT, "id">,
): Promise<PreBuildT> => {
  const endpoint = "/preBuilds"
  return makeRestRequest<PreBuildT>({
    endpoint,
    method: "POST",
    body: JSON.stringify(newPreBuild),
    successMessage: "PreBuild Created!",
  })
}

export const getAllPreBuildsRequest = async ({
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

  return makeRestRequest<{ data: PreBuildT[]; paging: PagingT }>({
    endpoint: `/preBuilds?${query}`,
    method: "GET",
  })
}

export const updatePreBuildRequest = async (updatedPreBuild: PreBuildT): Promise<PreBuildT> => {
  const endpoint = `/preBuilds/${updatedPreBuild.id}`
  return makeRestRequest<PreBuildT>({
    endpoint,
    method: "PUT",
    body: JSON.stringify(updatedPreBuild),
    successMessage: "PreBuild Updated!",
  })
}

export const deletePreBuildRequest = async (id: number): Promise<void> => {
  const endpoint = `/preBuilds/${id}`
  return makeRestRequest<void>({ endpoint, method: "DELETE", successMessage: "PreBuild Deleted!" })
}

export const smartCheckPreBuildRequest = async (smartCheckData: {
  id: number
  month: number
  year: number
  crystalIds: number[]
  cycle: string
  subscriptionId: number
}): Promise<{
  barredCrystalIds: number[]
  outInventoryCrystalIds: number[]
}> => {
  const endpoint = `/preBuilds/${smartCheckData.id}/smartCheck`
  return makeRestRequest<{
    barredCrystalIds: number[]
    outInventoryCrystalIds: number[]
  }>({
    endpoint,
    method: "POST",
    body: JSON.stringify(smartCheckData),
  })
}

export const smartCheckSelectedPrebuildsRequest = async (smartCheckData: {
  prebuildIds: number[]
  month: number
  year: number
}): Promise<{
  badPrebuildIds: number[]
}> => {
  const endpoint = `/preBuilds/smartCheckSelected`
  return makeRestRequest<{
    badPrebuildIds: number[]
  }>({
    endpoint,
    method: "POST",
    body: JSON.stringify(smartCheckData),
  })
}
