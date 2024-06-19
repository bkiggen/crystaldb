import type { CrystalT } from "./Crystal"
import type { SubscriptionT } from "./Subscription"

export type PreBuildT = {
  id: number
  cycle: number
  crystalIds: number[]
  crystals?: CrystalT[]
  createdAt?: string
  updatedAt?: string
  subscriptionId: number
  subscription?: SubscriptionT
}
