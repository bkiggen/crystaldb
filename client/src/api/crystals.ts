import type { CrystalT } from "../types/Crystal"
import { makeRestRequest } from "./makeRequest"
import type { PagingT } from "../types/Paging"

export const createCrystalRequest = async (newCrystal: Omit<CrystalT, "id">): Promise<CrystalT> => {
  const endpoint = "/crystals"
  return makeRestRequest<CrystalT>({
    endpoint,
    method: "POST",
    body: JSON.stringify(newCrystal),
    successMessage: "Crystal Created!",
  })
}

export const updateCrystalRequest = async (
  crystalId,
  updatedCrystal: Omit<CrystalT, "id">,
): Promise<CrystalT> => {
  const endpoint = `/crystals/${crystalId}`
  return makeRestRequest<CrystalT>({
    endpoint,
    method: "PUT",
    body: JSON.stringify(updatedCrystal),
    successMessage: "Crystal Updated!",
  })
}

export const deleteCrystalRequest = async (crystalId: number): Promise<void> => {
  const endpoint = `/crystals/${crystalId}`
  return makeRestRequest<void>({ endpoint, method: "DELETE", successMessage: "Crystal Deleted!" })
}

export const fetchCrystalsRequest = async ({
  searchTerm = "",
  page = 1,
  pageSize = 100,
  noPaging = false,
  sortBy = "",
  sortDirection = "",
  inventory,
  filters,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
  sortBy?: string
  sortDirection?: string
  inventory?: string
  filters?: Record<string, string>
}): Promise<{ data: CrystalT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    ...(noPaging ? {} : { page: page.toString() }),
    ...(noPaging ? {} : { pageSize: pageSize.toString() }),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(inventory ? { inventory } : {}),
    ...filters,
  }).toString()
  const endpoint = `/crystals?${query}`
  return makeRestRequest<{ data: CrystalT[]; paging: PagingT }>({ endpoint, method: "GET" })
}

export const getSuggestedCrystalsRequest = async ({
  searchTerm = "",
  page = 1,
  selectedCrystalIds = [],
  excludedCrystalIds = [],
  pageSize = 100,
  selectedSubscriptionType,
  selectedMonth,
  selectedYear,
  selectedCycle,
  selectedCycleRangeStart,
  selectedCycleRangeEnd,
  filters = {},
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
  selectedCycleRangeStart?: number
  selectedCycleRangeEnd?: number
  filters?: Record<string, string>
}) => {
  const selectedCrystalIdsParam = selectedCrystalIds.length > 0 ? selectedCrystalIds.join(",") : ""
  const excludedCrystalIdsParam = excludedCrystalIds.length > 0 ? excludedCrystalIds.join(",") : ""

  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
    subscriptionId: selectedSubscriptionType,
    month: selectedMonth.toString(),
    year: selectedYear.toString(),
    ...(selectedCycle ? { cycle: selectedCycle.toString() } : {}),
    ...(selectedCycleRangeStart ? { cycleRangeStart: selectedCycleRangeStart.toString() } : {}),
    ...(selectedCycleRangeEnd ? { cycleRangeEnd: selectedCycleRangeEnd.toString() } : {}),
    selectedCrystalIds: selectedCrystalIdsParam,
    excludedCrystalIds: excludedCrystalIdsParam,
    ...filters,
  }).toString()

  const endpoint = `/crystals/suggested?${query}`

  return makeRestRequest<{ data: CrystalT[]; paging: PagingT }>({
    endpoint,
    method: "GET",
  })
}
