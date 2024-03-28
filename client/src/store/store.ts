import { create } from "zustand"

type StoreT = {
  isFullScreen: boolean
  toggleFullscreen: () => void
}

export const useStore = create<StoreT>((set) => ({
  isFullScreen: false,
  toggleFullscreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
}))
