import type { ShipmentT } from "../types/Shipment"
import { makeRestRequest } from "./makeRequest"
import type { PagingT } from "../types/Paging"

export const createShipmentRequest = async (
  newShipment: Omit<ShipmentT, "id" | "cycle"> & {
    cycleString: string
  },
): Promise<ShipmentT[]> => {
  const endpoint = "/shipments"
  return makeRestRequest<ShipmentT[]>({
    endpoint,
    method: "POST",
    body: JSON.stringify(newShipment),
    successMessage: "Shipment Created!",
  })
}

export const getAllShipments = async ({
  searchTerm = "",
  page = 1,
  pageSize = 50,
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

  return makeRestRequest<{ data: ShipmentT[]; paging: PagingT }>({
    endpoint: `/shipments?${query}`,
    method: "GET",
  })
}

export const updateShipmentRequest = async (updatedShipment: ShipmentT): Promise<ShipmentT> => {
  const endpoint = `/shipments/${updatedShipment.id}`
  return makeRestRequest<ShipmentT>({
    endpoint,
    method: "PUT",
    body: JSON.stringify(updatedShipment),
    successMessage: "Shipment Updated!",
  })
}

export const deleteShipmentsRequest = async (shipmentIdArr: number[]): Promise<ShipmentT> => {
  const endpoint = `/shipments/${shipmentIdArr.join(",")}`
  return makeRestRequest<ShipmentT>({
    endpoint,
    method: "DELETE",
    successMessage: "Shipment Deleted!",
  })
}
