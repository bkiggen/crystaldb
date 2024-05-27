import type { ColorT } from "../types/Color"
import { makeRestRequest } from "./makeRequest"

export const getAllColorsRequest = async (): Promise<ColorT[]> => {
  const endpoint = "/colors"
  return makeRestRequest<ColorT[]>({ endpoint, method: "GET" })
}

export const createColorRequest = async (newColor: ColorT): Promise<ColorT> => {
  const endpoint = "/colors"
  const body = JSON.stringify(newColor)
  return makeRestRequest<ColorT>({
    endpoint,
    method: "POST",
    body,
    successMessage: "Color Created!",
  })
}

export const updateColorRequest = async (id: number, updatedColor: ColorT): Promise<ColorT> => {
  const endpoint = `/colors/${id}`
  const body = JSON.stringify(updatedColor)
  return makeRestRequest<ColorT>({
    endpoint,
    method: "PUT",
    body,
    successMessage: "Color Updated!",
  })
}

export const deleteColorRequest = async (id: number): Promise<void> => {
  const endpoint = `/colors/${id}`
  return makeRestRequest<void>({ endpoint, method: "DELETE", successMessage: "Color Deleted!" })
}
