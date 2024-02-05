import { CrystalT } from "./Crystal"

export type CycleT = {
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
