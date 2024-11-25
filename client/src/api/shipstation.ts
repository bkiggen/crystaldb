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

// export const fetchShipments = async ({ newPage = 1, setLoading }) => {
//   setLoading(true)

//   try {
//     const response: any = await callShipStationApi({
//       method: "GET",
//       path: `/orders?page=${newPage}&pageSize=50&orderStatus=awaiting_shipment`,
//     })
//     const out = response.orders.map((order) => {
//       return order.orderStatus
//     })
//     console.log("🚀 ~ fetchShipments ~ response:", out)

//     setPage(newPage)
//     setRows(mapOrdersToRows(response.orders)) // Map orders to DataGrid rows
//     setItemCount(response.total)
//   } catch (error) {
//     console.error("Error fetching shipments:", error)
//   } finally {
//     setLoading(false)
//   }
// }
