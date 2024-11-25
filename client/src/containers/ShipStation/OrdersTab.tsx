import { useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { callShipStationApi } from "../../api/shipstation"
import Pagination from "../../components/Pagination"
import { Box } from "@mui/material"

const OrdersTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [page, setPage] = useState(1)

  const mapOrdersToRows = (orders) =>
    orders.map((order) => ({
      id: order.orderId || "—",
      customer_id: order.customerId || "—",
      status: order.orderStatus || "—",
      created_at: order.createDate || "—",
      adjusted_ordered_at: order.orderDate || "—",
      shipped_at: order.shipDate || "—",
      tracking_number: order.advancedOptions?.customField1 || "—",
      type: order.advancedOptions?.source || "—",
    }))

  const fetchShipments = async ({ page = 1 }) => {
    setLoading(true)

    try {
      const response: any = await callShipStationApi({
        method: "GET",
        path: `/orders?page=${page}&pageSize=50&orderStatus=awaiting_shipment`,
      })
      const out = response.orders.map((order) => {
        return order.orderStatus
      })
      console.log("🚀 ~ fetchShipments ~ response:", out)

      setPage(page)
      setRows(mapOrdersToRows(response.orders)) // Map orders to DataGrid rows
      setItemCount(response.total)
    } catch (error) {
      console.error("Error fetching shipments:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "customer_id", headerName: "Customer ID", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <Box sx={{ textTransform: "capitalize" }}>{params.value.replace("_", " ") || "—"}</Box>
        )
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 150,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
    },
    {
      field: "adjusted_ordered_at",
      headerName: "Updated At",
      width: 150,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
    },
    {
      field: "shipped_at",
      headerName: "Shipped At",
      width: 150,
      renderCell: (params) => {
        return params.value ? (
          <Box>—</Box>
        ) : (
          new Date(params.value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })
        )
      },
    },
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
