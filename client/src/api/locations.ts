import type { LocationT } from "../types/Location"
import { makeRestRequest } from "./makeRequest"

export const getAllLocationsRequest = async (): Promise<LocationT[]> => {
  const endpoint = "/locations"
  return makeRestRequest<LocationT[]>({ endpoint, method: "GET" })
}

export const createLocationRequest = async (newLocation: LocationT): Promise<LocationT> => {
  const endpoint = "/locations"
  const body = JSON.stringify(newLocation)
  return makeRestRequest<LocationT>({
    endpoint,
    method: "POST",
    body,
    successMessage: "Location Created!",
  })
}

export const updateLocationRequest = async (
  id: number,
  updatedLocation: LocationT,
): Promise<LocationT> => {
  const endpoint = `/locations/${id}`
  const body = JSON.stringify(updatedLocation)
  return makeRestRequest<LocationT>({
    endpoint,
    method: "PUT",
    body,
    successMessage: "Location Updated!",
  })
}

export const deleteLocationRequest = async (id: number): Promise<void> => {
  const endpoint = `/locations/${id}`
  return makeRestRequest<void>({ endpoint, method: "DELETE", successMessage: "Location Deleted!" })
}
