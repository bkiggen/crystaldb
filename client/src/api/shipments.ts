import type { ShipmentT } from "../types/Shipment"
import { makeRestRequest } from "./makeRequest"

export const createShipment = async (newShipment: Omit<ShipmentT, "id">): Promise<ShipmentT> => {
  const endpoint = "/shipments"
  return makeRestRequest<ShipmentT>(endpoint, "POST", JSON.stringify(newShipment))
}

export const getAllShipments = async (): Promise<ShipmentT[]> => {
  const endpoint = "/shipments"
  return makeRestRequest<ShipmentT[]>(endpoint, "GET")
}
