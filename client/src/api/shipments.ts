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
  month,
  year,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
  subscriptionId?: string
  month?: number
  year?: number
}): Promise<{ data: ShipmentT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    ...(subscriptionId ? { subscriptionId } : {}),
    ...(month ? { month: month.toString() } : {}),
    ...(year ? { year: year.toString() } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
  }).toString()

  return makeRestRequest<{ data: ShipmentT[]; paging: PagingT }>(`/shipments?${query}`, "GET")
}

export const updateShipment = async (updatedShipment: ShipmentT): Promise<ShipmentT> => {
  const endpoint = `/shipments/${updatedShipment.id}`
  return makeRestRequest<ShipmentT>(endpoint, "PUT", JSON.stringify(updatedShipment))
}

export const deleteShipment = async (shipmentId: number): Promise<ShipmentT> => {
  const endpoint = `/shipments/${shipmentId}`
  console.log("🚀 ~ deleteShipment ~ endpoint:", endpoint)
  return makeRestRequest<ShipmentT>(endpoint, "DELETE")
}