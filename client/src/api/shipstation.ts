import { makeRestRequest } from "./makeRequest"

// Function to make an API call
export async function callShipStationApi(body) {
  const successMessage = body.method === "GET" ? undefined : "ShipStation update successful"

  return makeRestRequest({
    endpoint: `/shipstation`,
    method: "POST",
    body: JSON.stringify(body),
    successMessage,
  })
}
