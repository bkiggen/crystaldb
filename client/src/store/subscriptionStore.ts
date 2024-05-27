import { create } from "zustand"
import type { SubscriptionT } from "../types/Subscription"
import { fetchSubscriptionsRequest } from "../api/subscriptions"

type SubscriptionStoreT = {
  subscriptions: SubscriptionT[]
  fetchSubscriptions: () => Promise<void>
}

export const useSubscriptionStore = create<SubscriptionStoreT>((set) => ({
  subscriptions: [],

  fetchSubscriptions: async () => {
    try {
      const data = await fetchSubscriptionsRequest()
      set({ subscriptions: data })
    } catch (error) {
      console.error("Failed to fetch subscriptions", error)
    }
  },
}))
