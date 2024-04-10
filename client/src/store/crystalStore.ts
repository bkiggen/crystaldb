import { create } from "zustand"
import { CrystalT } from "../types/Crystal"

type CrystalStoreT = {
  suggestedCrystals: CrystalT[]
  setSuggestedCrystals: (crystals: CrystalT[]) => void
}

export const useCrystalStore = create<CrystalStoreT>((set) => ({
  suggestedCrystals: [],
  setSuggestedCrystals: (newSuggestedCrystals) =>
    set(() => ({ suggestedCrystals: newSuggestedCrystals })),
}))
