import type { CategoryT } from "../types/Category"
import { makeRestRequest } from "./makeRequest"

export const getAllCategoriesRequest = async (): Promise<CategoryT[]> => {
  const endpoint = "/categories"
  return makeRestRequest<CategoryT[]>({ endpoint, method: "GET" })
}

export const createCategoryRequest = async (newCategory: CategoryT): Promise<CategoryT> => {
  const endpoint = "/categories"
  const body = JSON.stringify(newCategory)
  return makeRestRequest<CategoryT>({
    endpoint,
    method: "POST",
    body,
    successMessage: "Category Created!",
  })
}

export const updateCategoryRequest = async (
  id: number,
  updatedCategory: CategoryT,
): Promise<CategoryT> => {
  const endpoint = `/categories/${id}`
  const body = JSON.stringify(updatedCategory)
  return makeRestRequest<CategoryT>({
    endpoint,
    method: "PUT",
    body,
    successMessage: "Category Updated!",
  })
}

export const deleteCategoryRequest = async (id: number): Promise<void> => {
  const endpoint = `/categories/${id}`
  return makeRestRequest<void>({ endpoint, method: "DELETE", successMessage: "Category Deleted!" })
}
