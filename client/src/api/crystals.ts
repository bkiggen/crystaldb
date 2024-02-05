import type { CrystalT } from "../types/Crystal"
import { makeRestRequest } from "./makeRequest"

export const createCrystal = async (newCrystal: Omit<CrystalT, "id">): Promise<CrystalT> => {
  const endpoint = "/crystals"
  return makeRestRequest<CrystalT>(endpoint, "POST", JSON.stringify(newCrystal))
}

export const getAllCrystals = async (): Promise<CrystalT[]> => {
  const endpoint = "/crystals"
  return makeRestRequest<CrystalT[]>(endpoint, "GET")
}
