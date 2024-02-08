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
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
}): Promise<{ data: CrystalT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
  }).toString()
  const endpoint = `/crystals?${query}`
  return makeRestRequest<{ data: CrystalT[]; paging: PagingT }>(endpoint, "GET")
}
