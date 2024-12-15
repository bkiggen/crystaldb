import { makeRestRequest } from "./makeRequest"

// Function to make an API call
export async function callCratejoyApi(body) {
  const successMessage = body.method === "GET" ? undefined : "CrateJoy update successful"

  return makeRestRequest({
    endpoint: `/cratejoy`,
    method: "POST",
    body: JSON.stringify(body),
    successMessage,
  })
}
