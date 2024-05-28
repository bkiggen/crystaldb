import { create } from "zustand"
import { CategoryT } from "../types/Category"
import {
  getAllCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from "../api/categories"

type CategoryStoreT = {
  categories: CategoryT[]
  setCategories: (categories: CategoryT[]) => void
  createCategory: (newCategory: CategoryT) => Promise<void>
  updateCategory: (id: number, updatedCategory: CategoryT) => Promise<void>
  deleteCategory: (id: number) => Promise<void>
  fetchCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryStoreT>((set) => ({
  categories: [],
  setCategories: (newCategories) => set(() => ({ categories: newCategories })),
  createCategory: async (newCategory) => {
    const createdCategory = await createCategoryRequest(newCategory)
    set((state) => ({ categories: [...state.categories, createdCategory] }))
  },
  updateCategory: async (id, updatedCategory) => {
    const updated = await updateCategoryRequest(id, updatedCategory)
    set((state) => ({
      categories: state.categories.map((category) => (category.id === id ? updated : category)),
    }))
  },
  deleteCategory: async (id) => {
    await deleteCategoryRequest(id)
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }))
  },
  fetchCategories: async () => {
    const categories = await getAllCategoriesRequest()
    set({ categories })
  },
}))
