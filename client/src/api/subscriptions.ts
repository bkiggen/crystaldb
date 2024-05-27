import type { SubscriptionT } from "../types/Subscription"
import { makeRestRequest } from "./makeRequest"

export const fetchSubscriptionsRequest = async (): Promise<SubscriptionT[]> => {
  const endpoint = "/subscriptions"
  return makeRestRequest<SubscriptionT[]>({ endpoint, method: "GET" })
}
