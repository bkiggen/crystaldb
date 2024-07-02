import { create } from "zustand"
import { CrystalT } from "../types/Crystal"
import {
  createCrystalRequest,
  updateCrystalRequest,
  deleteCrystalRequest,
  fetchCrystalsRequest,
  getSuggestedCrystalsRequest,
  getUnusedCrystalsRequest,
  fetchCrystalByIdRequest,
} from "../api/crystals"
import { PagingT, defaultPaging } from "../types/Paging"

type CrystalStoreT = {
  suggestedCrystals: CrystalT[]
  unusedCrystals: CrystalT[]
  crystals: CrystalT[]
  selectedCrystal: CrystalT
  crystalMatches: CrystalT[]
  fetchCrystalMatches: (params: { searchTerm?: string; noPaging?: boolean }) => Promise<void>
  paging: PagingT | null
  setSuggestedCrystals: (crystals: CrystalT[]) => void
  setCrystals: (crystals: CrystalT[]) => void
  createCrystal: (newCrystal: Omit<CrystalT, "id">) => Promise<void>
  updateCrystal: (crystalId: number, updatedCrystal: Omit<CrystalT, "id">) => Promise<void>
  deleteCrystal: (crystalId: number) => Promise<void>
  fetchCrystals: (params: {
    searchTerm?: string
    page?: number
    pageSize?: number
    noPaging?: boolean
    sortBy?: string
    sortDirection?: string
    inventory?: string
    filters?: Record<string, string>
  }) => Promise<void>
  fetchSuggestedCrystals: (params: {
    searchTerm?: string
    page?: number
    selectedCrystalIds?: number[]
    excludedCrystalIds?: number[]
    pageSize?: number
    selectedSubscriptionType?: string
    selectedMonth?: number
    selectedYear?: number
    selectedCyclesString?: number
    filters?: Record<string, string>
  }) => Promise<void>
  fetchUnusedCrystals: () => Promise<void>
}

export const useCrystalStore = create<CrystalStoreT>((set) => ({
  suggestedCrystals: [],
  crystals: [],
  selectedCrystal: null,
  unusedCrystals: [],
  crystalMatches: [],
  fetchCrystalMatches: async (params) => {
    const { data } = await fetchCrystalsRequest(params)
    set({ crystalMatches: data })
  },
  paging: defaultPaging,
  setSuggestedCrystals: (newSuggestedCrystals) =>
    set(() => ({ suggestedCrystals: newSuggestedCrystals })),
  setCrystals: (newCrystals) => set(() => ({ crystals: newCrystals })),
  createCrystal: async (newCrystal) => {
    const createdCrystal = await createCrystalRequest(newCrystal)
    set((state) => ({ crystals: [createdCrystal, ...state.crystals] }))
  },
  updateCrystal: async (crystalId, updatedCrystal) => {
    const updated = await updateCrystalRequest(crystalId, updatedCrystal)
    set((state) => ({
      crystals: state.crystals.map((crystal) => (crystal.id === crystalId ? updated : crystal)),
    }))
  },
  deleteCrystal: async (crystalId) => {
    await deleteCrystalRequest(crystalId)
    set((state) => ({
      crystals: state.crystals.filter((crystal) => crystal.id !== crystalId),
    }))
  },
  fetchCrystals: async (params) => {
    const { data, paging } = await fetchCrystalsRequest(params)
    set({ crystals: data, paging })
  },
  fetchSuggestedCrystals: async (params) => {
    const { data } = await getSuggestedCrystalsRequest(params)
    set({ suggestedCrystals: data })
  },
  fetchUnusedCrystals: async () => {
    const { data } = await getUnusedCrystalsRequest()
    set({ unusedCrystals: data })
  },
  fetchCrystalById: async (crystalId) => {
    const { data } = await fetchCrystalByIdRequest(crystalId)
    set({ selectedCrystal: data })
  },
  setSelectedCrystal: (selectedCrystal) => set({ selectedCrystal }),
}))
