import { CrystalT } from "./Crystal"

export type ShipmentT = {
  id: number
  month: number
  year: number
  cycle: number
  cycleRangeStart: number
  cycleRangeEnd: number
  crystalIds: number[]
  crystals?: CrystalT[]
  createdAt?: string
  updatedAt?: string
}
