import { create } from "zustand"
import { ColorT } from "../types/Color"
import {
  getAllColorsRequest,
  createColorRequest,
  updateColorRequest,
  deleteColorRequest,
} from "../api/colors"

type ColorStoreT = {
  colors: ColorT[]
  setColors: (colors: ColorT[]) => void
  createColor: (newColor: ColorT) => Promise<void>
  updateColor: (id: number, updatedColor: ColorT) => Promise<void>
  deleteColor: (id: number) => Promise<void>
  fetchColors: () => Promise<void>
}

export const useColorStore = create<ColorStoreT>((set) => ({
  colors: [],
  setColors: (newColors) => set(() => ({ colors: newColors })),
  createColor: async (newColor) => {
    const createdColor = await createColorRequest(newColor)
    set((state) => ({ colors: [...state.colors, createdColor] }))
  },
  updateColor: async (id, updatedColor) => {
    const updated = await updateColorRequest(id, updatedColor)
    set((state) => ({
      colors: state.colors.map((color) => (color.id === id ? updated : color)),
    }))
  },
  deleteColor: async (id) => {
    await deleteColorRequest(id)
    set((state) => ({
      colors: state.colors.filter((color) => color.id !== id),
    }))
  },
  fetchColors: async () => {
    const colors = await getAllColorsRequest()
    set({ colors })
  },
}))
