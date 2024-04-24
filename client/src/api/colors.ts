import type { ColorT } from "../types/Color"
import { makeRestRequest } from "./makeRequest"

export const getAllColors = async (): Promise<ColorT[]> => {
  const endpoint = "/colors"
  return makeRestRequest<ColorT[]>({ endpoint, method: "GET" })
}

export const createColor = async (newColor: ColorT): Promise<ColorT> => {
  const endpoint = "/colors"
  const body = JSON.stringify(newColor)
  return makeRestRequest<ColorT>({
    endpoint,
    method: "POST",
    body,
    successMessage: "Color Created!",
  })
}

export const updateColor = async (id: string, updatedColor: ColorT): Promise<ColorT> => {
  const endpoint = `/colors/${id}`
  const body = JSON.stringify(updatedColor)
  return makeRestRequest<ColorT>({
    endpoint,
    method: "PUT",
    body,
    successMessage: "Color Updated!",
  })
}

export const deleteColor = async (id: string): Promise<void> => {
  const endpoint = `/colors/${id}`
  return makeRestRequest<void>({ endpoint, method: "DELETE", successMessage: "Color Deleted!" })
}
