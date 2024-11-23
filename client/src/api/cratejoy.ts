import { makeRestRequest } from "./makeRequest"

// Function to make an API call
export async function callCratejoyApi(body) {
  console.log("🚀 ~ callCratejoyApi ~ body:", body)
  return makeRestRequest({
    endpoint: `/cratejoy`,
    method: "POST",
    body: JSON.stringify(body),
  })
}
