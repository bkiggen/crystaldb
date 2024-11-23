import { useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { callCratejoyApi } from "../../api/cratejoy"
import Pagination from "../../components/Pagination"
import { Button } from "@mui/material"

const SubscriptionsTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [page, setPage] = useState(0)

  const fetchSubscriptions = async (newData) => {
    setLoading(true)

    const newPage = newData.page
    try {
      const response: any = await callCratejoyApi({
        method: "GET",
        path: `/subscriptions?page=${newPage}`,
      })

      setPage(newPage)
      setRows(response.results)
      setItemCount(response.count)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "billing_name", headerName: "Billing Name", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "start_date", headerName: "Start Date", width: 200 },
    { field: "end_date", headerName: "End Date", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "store_id", headerName: "Store ID", width: 150 },
  ]

  return (
    <div style={{ height: 600, width: "100%" }}>
      <Pagination
        fetchData={fetchSubscriptions}
        paging={{
          currentPage: page,
          totalPages: Math.ceil(itemCount / 50),
          totalCount: itemCount,
          pageSize: 50,
        }}
        filterContent={<Button variant="contained">Filter Subscriptions</Button>}
        withoutSearch
        onDataChange={fetchSubscriptions}
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

export default SubscriptionsTab
