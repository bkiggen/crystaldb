import { create } from "zustand"
import { LocationT } from "../types/Location"
import {
  getAllLocationsRequest,
  createLocationRequest,
  updateLocationRequest,
  deleteLocationRequest,
} from "../api/locations"

type LocationStoreT = {
  locations: LocationT[]
  setLocations: (locations: LocationT[]) => void
  createLocation: (newLocation: LocationT) => Promise<void>
  updateLocation: (id: number, updatedLocation: LocationT) => Promise<void>
  deleteLocation: (id: number) => Promise<void>
  fetchLocations: () => Promise<void>
}

export const useLocationStore = create<LocationStoreT>((set) => ({
  locations: [],
  setLocations: (newLocations) => set(() => ({ locations: newLocations })),
  createLocation: async (newLocation) => {
    const createdLocation = await createLocationRequest(newLocation)
    set((state) => ({ locations: [...state.locations, createdLocation] }))
  },
  updateLocation: async (id, updatedLocation) => {
    const updated = await updateLocationRequest(id, updatedLocation)
    set((state) => ({
      locations: state.locations.map((location) => (location.id === id ? updated : location)),
    }))
  },
  deleteLocation: async (id) => {
    await deleteLocationRequest(id)
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id),
    }))
  },
  fetchLocations: async () => {
    const locations = await getAllLocationsRequest()
    set({ locations })
  },
}))
