import { CrystalT } from "./Crystal"
import type { SubscriptionT } from "./Subscription"

export type ShipmentT = {
  id: number
  month: number
  year: number
  cycle: number
  crystalIds: number[]
  crystals?: CrystalT[]
  createdAt?: string
  updatedAt?: string
  subscriptionId: number
  subscription?: SubscriptionT
  userCount: number
  userCountIsNew: boolean
}
