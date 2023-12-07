import { CrystalT } from "./Crystal"

export type CycleT = {
  id: number
  // shippedOn?: string
  calendarMonth: number
  cycleMonth: number
  crystals?: CrystalT[]
  crystalIds: number[]
  createdAt?: string
  updatedAt?: string
}
