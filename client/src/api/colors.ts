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
