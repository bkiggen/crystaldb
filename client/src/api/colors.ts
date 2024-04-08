import type { ColorT } from "../types/Color"
import { makeRestRequest } from "./makeRequest" // Utility function we will create

export const getAllColors = async (): Promise<ColorT[]> => {
  const endpoint = "/colors"
  return makeRestRequest<ColorT[]>(endpoint, "GET")
}

export const createColor = async (newColor: ColorT): Promise<ColorT> => {
  const endpoint = "/colors"
  const body = JSON.stringify(newColor)
  return makeRestRequest<ColorT>(endpoint, "POST", body)
}

export const updateColor = async (id: string, updatedColor: ColorT): Promise<ColorT> => {
  const endpoint = `/colors/${id}`
  const body = JSON.stringify(updatedColor)
  return makeRestRequest<ColorT>(endpoint, "PUT", body)
}

export const deleteColor = async (id: string): Promise<void> => {
  const endpoint = `/colors/${id}`
  return makeRestRequest<void>(endpoint, "DELETE")
}
