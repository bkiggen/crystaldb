import type { CrystalT } from "../types/Crystal"
import { makeRestRequest } from "./makeRequest"
import type { PagingT } from "../types/Paging"

export const createCrystal = async (newCrystal: Omit<CrystalT, "id">): Promise<CrystalT> => {
  const endpoint = "/crystals"
  return makeRestRequest<CrystalT>(endpoint, "POST", JSON.stringify(newCrystal))
}

export const getAllCrystals = async ({
  searchTerm = "",
  page = 1,
  pageSize = 100,
  noPaging = false,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
}): Promise<{ data: CrystalT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
  }).toString()
  const endpoint = noPaging ? "/crystals" : `/crystals?${query}`
  return makeRestRequest<{ data: CrystalT[]; paging: PagingT }>(endpoint, "GET")
}

export const getSuggestedCrystals = async ({
  searchTerm = "",
  page = 1,
  selectedCrystalIds = [],
  excludedCrystalIds = [],
  pageSize = 100,
  selectedSubscriptionType,
  selectedMonth,
  selectedYear,
  selectedCycle,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
  selectedCrystalIds?: number[]
  excludedCrystalIds?: number[]
  selectedSubscriptionType?: string
  selectedMonth?: number
  selectedYear?: number
  selectedCycle?: number
}): Promise<{ data: CrystalT[]; paging: PagingT }> => {
  const selectedCrystalIdsParam = selectedCrystalIds.length > 0 ? selectedCrystalIds.join(",") : ""
  const excludedCrystalIdsParam = excludedCrystalIds.length > 0 ? excludedCrystalIds.join(",") : ""

  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
    subscriptionType: selectedSubscriptionType,
    month: selectedMonth.toString(),
    year: selectedYear.toString(),
    cycle: selectedCycle.toString(),
    selectedCrystalIds: selectedCrystalIdsParam,
    excludedCrystalIds: excludedCrystalIdsParam,
  }).toString()
  const endpoint = `/crystals/suggested?${query}`

  return makeRestRequest<{ data: CrystalT[]; paging: PagingT }>(endpoint, "GET")
}
