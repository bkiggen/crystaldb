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
    successMessage: "Shipment(s) Created!",
  })
}

export const getAllShipments = async ({
  searchTerm = "",
  page = 1,
  pageSize = 50,
  subscriptionId,
  month,
  cycle,
  year,
  isGrouped,
}: {
  searchTerm?: string
  page?: number
  pageSize?: number
  noPaging?: boolean
  subscriptionId?: string
  month?: number
  year?: number
  cycle?: string
  isGrouped?: boolean
}): Promise<{ data: ShipmentT[]; paging: PagingT }> => {
  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    ...(subscriptionId ? { subscriptionId } : {}),
    ...(month ? { month: month.toString() } : {}),
    ...(year ? { year: year.toString() } : {}),
    ...(cycle ? { cycle } : {}),
    page: page.toString(),
    pageSize: pageSize.toString(),
    isGrouped: isGrouped ? "true" : "false",
  }).toString()

  return makeRestRequest<{ data: ShipmentT[]; paging: PagingT }>({
    endpoint: `/shipments?${query}`,
    method: "GET",
  })
}

export const updateShipmentRequest = async (
  updatedShipment: ShipmentT & { isBulkEdit: boolean },
): Promise<ShipmentT[]> => {
  const endpoint = `/shipments/${updatedShipment.id}`
  return makeRestRequest<ShipmentT[]>({
    endpoint,
    method: "PUT",
    body: JSON.stringify(updatedShipment),
    successMessage: "Shipment Updated!",
  })
}

export const updateSelectedShipmentsRequest = async ({
  newData,
  selectedIds,
}: {
  newData: ShipmentT & { isBulkEdit: boolean }
  selectedIds: number[]
}): Promise<ShipmentT[]> => {
  const endpoint = `/shipments/updateSelected`
  return makeRestRequest<ShipmentT[]>({
    endpoint,
    method: "POST",
    body: JSON.stringify({ newData, selectedIds }),
    successMessage: "Shipments Updated!",
  })
}

export const deleteShipmentsRequest = async ({
  shipmentIdArr,
  isBulkDelete,
}: {
  shipmentIdArr: number[]
  isBulkDelete: boolean
}): Promise<{ deletedIds: number[] }> => {
  const endpoint = `/shipments/${shipmentIdArr.join(",")}`
  return makeRestRequest<{ deletedIds: number[] }>({
    endpoint,
    method: "DELETE",
    successMessage: "Shipment Deleted!",
    body: JSON.stringify({ isBulkDelete }),
  })
}
