import { create } from "zustand"
import { ShipmentT } from "../types/Shipment"
import {
  getAllShipments,
  createShipmentRequest,
  updateShipmentRequest,
  deleteShipmentsRequest,
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
  createShipment: (
    newShipment: Omit<ShipmentT, "id" | "cycle"> & {
      cycleString: string
    },
  ) => Promise<void>
  updateShipment: (updatedShipment: ShipmentT & { isBulkEdit: boolean }) => Promise<void>
  deleteShipments: ({
    shipmentIdArr,
    isBulkDelete,
  }: {
    shipmentIdArr: number[]
    isBulkDelete: boolean
  }) => Promise<void>
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useShipmentStore = create<ShipmentStoreT>((set) => ({
  shipments: [],
  paging: defaultPaging,
  loading: false,

  setPaging: (paging) => {
    set({ paging })
  },

  shipment: null,

  setShipment: (shipment) => {
    set({ shipment })
  },

  setLoading: (loading) => {
    set({ loading })
  },

  fetchShipments: async (params) => {
    set({ loading: true })
    try {
      const { data, paging } = await getAllShipments(params)
      set({ shipments: data, paging })
    } catch (error) {
      console.error("Failed to fetch shipments", error)
    } finally {
      set({ loading: false })
    }
  },

  createShipment: async (newShipment) => {
    try {
      const createdShipments = await createShipmentRequest(newShipment)
      set((state) => ({
        shipments: [...createdShipments, ...state.shipments],
      }))
    } catch (error) {
      console.error("Failed to create shipment", error)
    }
  },

  updateShipment: async (updatedShipment) => {
    try {
      const shipments = await updateShipmentRequest(updatedShipment)
      set((state) => ({
        shipments: state.shipments.map((s) => {
          const updatedShipment = shipments.find((us) => us.id === s.id)
          return updatedShipment ? updatedShipment : s
        }),
      }))
    } catch (error) {
      console.error("Failed to update shipment", error)
    }
  },

  deleteShipments: async ({ shipmentIdArr, isBulkDelete }) => {
    try {
      const { deletedIds } = await deleteShipmentsRequest({ shipmentIdArr, isBulkDelete })

      set((state) => ({
        shipments: state.shipments.filter((s) => !deletedIds.includes(s.id)),
      }))
    } catch (error) {
      console.error("Failed to delete shipments", error)
    }
  },
}))
