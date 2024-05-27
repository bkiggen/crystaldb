import { create } from "zustand"
import { ShipmentT } from "../types/Shipment"
import {
  getAllShipments,
  createShipmentRequest,
  updateShipmentRequest,
  deleteShipmentRequest,
} from "../api/shipments"
import { PagingT, defaultPaging } from "../types/Paging"

type ShipmentStoreT = {
  shipment: ShipmentT | null
  setShipment: (shipment: ShipmentT) => void
  shipments: ShipmentT[]
  paging: PagingT
  setPaging: (paging: PagingT) => void
  fetchShipments: (params: {
    searchTerm?: string
    page?: number
    pageSize?: number
    subscriptionId?: string
    month?: number
    year?: number
  }) => Promise<void>
  createShipment: (newShipment: Omit<ShipmentT, "id">) => Promise<void>
  updateShipment: (updatedShipment: ShipmentT) => Promise<void>
  deleteShipment: (shipmentId: number) => Promise<void>
}

export const useShipmentStore = create<ShipmentStoreT>((set) => ({
  shipments: [],

  paging: defaultPaging,

  setPaging: (paging) => {
    set({ paging })
  },

  shipment: null,

  setShipment: (shipment) => {
    set({ shipment })
  },

  fetchShipments: async (params) => {
    try {
      const { data, paging } = await getAllShipments(params)
      set({ shipments: data, paging })
    } catch (error) {
      console.error("Failed to fetch shipments", error)
    }
  },

  createShipment: async (newShipment) => {
    try {
      const createdShipment = await createShipmentRequest(newShipment)
      set((state) => ({
        shipments: [createdShipment, ...state.shipments],
      }))
    } catch (error) {
      console.error("Failed to create shipment", error)
    }
  },

  updateShipment: async (updatedShipment) => {
    try {
      const shipment = await updateShipmentRequest(updatedShipment)
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === shipment.id ? shipment : s)),
      }))
    } catch (error) {
      console.error("Failed to update shipment", error)
    }
  },

  deleteShipment: async (shipmentId) => {
    try {
      await deleteShipmentRequest(shipmentId)
      set((state) => ({
        shipments: state.shipments.filter((s) => s.id !== shipmentId),
      }))
    } catch (error) {
      console.error("Failed to delete shipment", error)
    }
  },
}))
