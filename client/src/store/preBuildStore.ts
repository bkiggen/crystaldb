import { create } from "zustand"
import type { PreBuildT } from "../types/PreBuild"
import {
  createPreBuildRequest,
  getAllPreBuildsRequest,
  updatePreBuildRequest,
  deletePreBuildRequest,
} from "../api/preBuilds"
import { defaultPaging, type PagingT } from "../types/Paging"

type PreBuildStoreT = {
  preBuilds: PreBuildT[]
  paging: PagingT | null
  fetchPreBuilds: (params: {
    searchTerm?: string
    page?: number
    pageSize?: number
    subscriptionId?: string
  }) => Promise<void>
  createPreBuild: (newPreBuild: Omit<PreBuildT, "id">) => Promise<void>
  updatePreBuild: (updatedPreBuild: PreBuildT) => Promise<void>
  deletePreBuild: (id: number) => Promise<void>
}

export const usePreBuildStore = create<PreBuildStoreT>((set) => ({
  preBuilds: [],
  paging: defaultPaging,

  fetchPreBuilds: async (params) => {
    try {
      const { data, paging } = await getAllPreBuildsRequest(params)
      set({ preBuilds: data, paging })
    } catch (error) {
      console.error("Failed to fetch pre-builds", error)
    }
  },

  createPreBuild: async (newPreBuild) => {
    try {
      const createdPreBuild = await createPreBuildRequest(newPreBuild)
      set((state) => ({
        preBuilds: [...state.preBuilds, createdPreBuild],
      }))
    } catch (error) {
      console.error("Failed to create pre-build", error)
    }
  },

  updatePreBuild: async (updatedPreBuild) => {
    try {
      const result = await updatePreBuildRequest(updatedPreBuild)
      console.log("🚀 ~ updatePreBuild: ~ result:", result)
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
}))
