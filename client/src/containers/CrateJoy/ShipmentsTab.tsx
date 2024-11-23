import { useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { callCratejoyApi } from "../../api/cratejoy"
import Pagination from "../../components/Pagination"
import { Button } from "@mui/material"

const ShipmentsTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [page, setPage] = useState(0)

  const fetchShipments = async (newData) => {
    setLoading(true)

    const newPage = newData.page
    try {
      const response: any = await callCratejoyApi({
        method: "GET",
        path: `/shipments?page=${newPage}`,
      })

      setPage(newPage)
      setRows(response.results)
      setItemCount(response.count)
    } catch (error) {
      console.error("Error fetching shipments:", error)
    } finally {
      setLoading(false)
    }
  }

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
        filterContent={<Button variant="contained">Filter Shipments</Button>}
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

export default ShipmentsTab
