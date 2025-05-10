import { create } from "zustand"
import type { PreBuildT } from "../types/PreBuild"
import {
  createPreBuildRequest,
  getAllPreBuildsRequest,
  updatePreBuildRequest,
  deletePreBuildRequest,
  smartCheckPreBuildRequest,
  smartCheckSelectedPrebuildsRequest,
} from "../api/preBuilds"
import { defaultPaging, type PagingT } from "../types/Paging"

type PreBuildStoreT = {
  preBuilds: PreBuildT[]
  paging: PagingT | null
  smartCheck: {
    badCrystalIds: number[]
    outInventoryCrystals: number[]
  }
  smartCheckLoading: boolean
  fetchPreBuilds: (params: {
    searchTerm?: string
    page?: number
    cycle?: string
    pageSize?: number
    subscriptionId?: string
  }) => Promise<void>
  smartCheckPrebuild: (smartCheckData: {
    id: number
    month: number
    year: number
    crystalIds: number[]
    cycle: string
    subscriptionId: number
  }) => Promise<void>
  smartCheckSelectedPrebuilds: (smartCheckData: {
    prebuildIds: number[]
    month: number
    year: number
  }) => Promise<void>
  createPreBuild: (newPreBuild: Omit<PreBuildT, "id">) => Promise<void>
  updatePreBuild: (updatedPreBuild: PreBuildT) => Promise<void>
  deletePreBuild: (id: number) => Promise<void>
  setPreBuildStore: (state: Partial<PreBuildStoreT>) => void
  badPrebuilds: any[]
  conflictingCyclePrebuilds: { id: number; conflictingIds: number[] }[]
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const usePreBuildStore = create<PreBuildStoreT>((set) => ({
  preBuilds: [],
  paging: defaultPaging,
  smartCheck: {
    badCrystalIds: [],
    outInventoryCrystals: [],
  },
  smartCheckLoading: false,
  badPrebuilds: [],
  conflictingCyclePrebuilds: [],
  loading: false,
  setLoading: (loading) => {
    set({ loading })
  },
  fetchPreBuilds: async (params) => {
    try {
      set(() => ({
        loading: true,
      }))
      const { data, paging } = await getAllPreBuildsRequest(params)
      set({ preBuilds: data, paging, loading: false })
    } catch (error) {
      console.error("Failed to fetch pre-builds", error)
    }
  },

  createPreBuild: async (newPreBuild) => {
    try {
      await createPreBuildRequest(newPreBuild)
      // set((state) => ({
      //   preBuilds: [createdPreBuild, ...state.preBuilds],
      // }))
    } catch (error) {
      console.error("Failed to create pre-build", error)
    }
  },

  updatePreBuild: async (updatedPreBuild) => {
    try {
      const result = await updatePreBuildRequest(updatedPreBuild)
      set((state) => ({
        preBuilds: state.preBuilds.map((preBuild) =>
          preBuild.id === result.id ? result : preBuild,
        ),
      }))
    } catch (error) {
      console.error("Failed to update pre-build", error)
    }
  },

  deletePreBuild: async (id) => {
    try {
      await deletePreBuildRequest(id)
      set((state) => ({
        preBuilds: state.preBuilds.filter((preBuild) => preBuild.id !== id),
      }))
    } catch (error) {
      console.error("Failed to delete pre-build", error)
    }
  },

  smartCheckPrebuild: async (smartCheckData: {
    id: number
    month: number
    year: number
    crystalIds: number[]
    cycle: string
    subscriptionId: number
  }) => {
    try {
      set(() => ({
        smartCheckLoading: true,
      }))
      const result = await smartCheckPreBuildRequest(smartCheckData)

      set(() => ({
        smartCheck: {
          badCrystalIds: result.barredCrystalIds,
          outInventoryCrystals: result.outInventoryCrystalIds,
        },
      }))
    } catch (error) {
      console.error("Failed to delete pre-build", error)
    } finally {
      set(() => ({
        smartCheckLoading: false,
      }))
    }
  },

  smartCheckSelectedPrebuilds: async (smartCheckData: {
    prebuildIds: number[]
    month: number
    year: number
  }) => {
    set(() => ({
      smartCheckLoading: true,
    }))
    try {
      const result = await smartCheckSelectedPrebuildsRequest(smartCheckData)

      set(() => ({
        badPrebuilds: result.badPrebuilds,
        conflictingCyclePrebuilds: result.conflictingCyclePrebuilds,
      }))
    } catch (error) {
      console.error("Failed to delete pre-build", error)
    } finally {
      set(() => ({
        smartCheckLoading: false,
      }))
    }
  },

  setPreBuildStore: (state: Partial<PreBuildStoreT>) => set(state),
}))
