import type { ShipmentT } from "../types/Shipment"
import { makeRestRequest } from "./makeRequest"
import type { PagingT } from "../types/Paging"

export const createShipment = async (newShipment: Omit<ShipmentT, "id">): Promise<ShipmentT> => {
  const endpoint = "/shipments"
  return makeRestRequest<ShipmentT>(endpoint, "POST", JSON.stringify(newShipment))
}

export const getAllShipments = async ({
  searchTerm = "",
  page = 1,
  pageSize = 100,
  subscriptionId,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
  subscriptionId?: string
}): Promise<{ data: ShipmentT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    ...(subscriptionId ? { subscriptionId } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
  }).toString()

  return makeRestRequest<{ data: ShipmentT[]; paging: PagingT }>(`/shipments?${query}`, "GET")
}

export const updateShipment = async (updatedShipment: ShipmentT): Promise<ShipmentT> => {
  const endpoint = `/shipments/${updatedShipment.id}`
  return makeRestRequest<ShipmentT>(endpoint, "PUT", JSON.stringify(updatedShipment))
}
