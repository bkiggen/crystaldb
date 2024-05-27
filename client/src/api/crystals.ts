import type { CrystalT } from "../types/Crystal"
import { makeRestRequest } from "./makeRequest"
import type { PagingT } from "../types/Paging"
import { useCrystalStore } from "../store/crystalStore"

export const createCrystal = async (newCrystal: Omit<CrystalT, "id">): Promise<CrystalT> => {
  const endpoint = "/crystals"
  return makeRestRequest<CrystalT>({
    endpoint,
    method: "POST",
    body: JSON.stringify(newCrystal),
    successMessage: "Crystal Created!",
  })
}

export const updateCrystal = async (
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

export const deleteCrystal = async (crystalId: number): Promise<void> => {
  const endpoint = `/crystals/${crystalId}`
  return makeRestRequest<void>({ endpoint, method: "DELETE", successMessage: "Crystal Deleted!" })
}

export const getAllCrystals = async ({
  searchTerm = "",
  page = 1,
  pageSize = 100,
  noPaging = false,
  sortBy = "",
  sortDirection = "",
  inventory,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
  sortBy?: string
  sortDirection?: string
  inventory?: string
}): Promise<{ data: CrystalT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    ...(noPaging ? {} : { page: page.toString() }),
    ...(noPaging ? {} : { pageSize: pageSize.toString() }),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(inventory ? { inventory } : {}),
  }).toString()
  const endpoint = `/crystals?${query}`
  return makeRestRequest<{ data: CrystalT[]; paging: PagingT }>({ endpoint, method: "GET" })
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

  const { data } = await makeRestRequest<{ data: CrystalT[]; paging: PagingT }>({
    endpoint,
    method: "GET",
  })

  useCrystalStore.getState().setSuggestedCrystals(data)

  return null
}
