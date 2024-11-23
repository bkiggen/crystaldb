import { useEffect, useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { callShipStationApi } from "../../api/shipstation"
import Pagination from "../../components/Pagination"

const OrdersTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [page, setPage] = useState(1)

  const mapOrdersToRows = (orders) =>
    orders.map((order) => ({
      id: order.orderId,
      customer_id: order.customerId,
      status: order.orderStatus,
      created_at: order.createDate,
      adjusted_ordered_at: order.orderDate,
      shipped_at: order.shipDate,
      tracking_number: order.advancedOptions?.customField1 || "N/A",
      type: order.advancedOptions?.source || "N/A",
    }))

  const fetchShipments = async (newData) => {
    setLoading(true)

    const newPage = newData.page || 1

    try {
      const response: any = await callShipStationApi({
        method: "GET",
        path: `/orders?page=${newPage}&pageSize=50`,
      })

      // Debugging response from ShipStation API
      console.log("🚀 ~ fetchShipments ~ response:", response)

      setPage(newPage)
      setRows(mapOrdersToRows(response.orders)) // Map orders to DataGrid rows
      setItemCount(response.total)
    } catch (error) {
      console.error("Error fetching shipments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShipments({ page: 1 })
  }, [])

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "customer_id", headerName: "Customer ID", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "created_at", headerName: "Created At", width: 200 },
    { field: "adjusted_ordered_at", headerName: "Adjusted Ordered At", width: 200 },
    { field: "shipped_at", headerName: "Shipped At", width: 200 },
    { field: "tracking_number", headerName: "Tracking Number", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
  ]

  return (
    <div style={{ width: "100%" }}>
      <Pagination
        fetchData={fetchShipments}
        paging={{
          currentPage: page,
          totalPages: Math.ceil(itemCount / 50),
          totalCount: itemCount,
          pageSize: 50,
        }}
        withoutSearch
        onDataChange={fetchShipments}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableColumnMenu
        disableColumnFilter
        hideFooter
        hideFooterPagination
        sx={{ background: "rgba(70, 90, 126, 0.4)", color: "white" }}
        autoHeight
      />
    </div>
  )
}

export default OrdersTab
