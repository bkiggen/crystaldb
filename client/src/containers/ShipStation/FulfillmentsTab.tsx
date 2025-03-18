import { useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { callShipStationApi } from "../../api/shipstation"
import Pagination from "../../components/Pagination"
import { Box } from "@mui/material"

const FulfillmentsTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [page, setPage] = useState(1)

  // Map fulfillments data to rows
  const mapFulfillmentsToRows = (fulfillments) =>
    fulfillments.map((fulfillment) => ({
      id: fulfillment.fulfillmentId,
      order_id: fulfillment.orderId,
      customer_email: fulfillment.customerEmail,
      tracking_number: fulfillment.trackingNumber,
      carrier: fulfillment.carrierCode,
      ship_date: fulfillment.shipDate,
      delivery_date: fulfillment.deliveryDate || "Pending",
      ship_to: `${fulfillment.shipTo.name}, ${fulfillment.shipTo.city}, ${fulfillment.shipTo.state} ${fulfillment.shipTo.postalCode}`,
    }))

  const fetchFulfillments = async (newData) => {
    setLoading(true)

    const newPage = newData.page || 1

    try {
      const response: any = await callShipStationApi({
        method: "GET",
        path: `/fulfillments?page=${newPage}&pageSize=50`,
      })

      setPage(newPage)
      setRows(mapFulfillmentsToRows(response.fulfillments)) // Map fulfillments to DataGrid rows
      setItemCount(response.total)
    } catch (error) {
      console.error("Error fetching fulfillments:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "Fulfillment ID", width: 200 },
    { field: "order_id", headerName: "Order ID", width: 150 },
    { field: "customer_email", headerName: "Customer Email", width: 250 },
    { field: "tracking_number", headerName: "Tracking Number", width: 200 },
    { field: "carrier", headerName: "Carrier", width: 150 },
    { field: "ship_date", headerName: "Ship Date", width: 200 },
    { field: "delivery_date", headerName: "Delivery Date", width: 200 },
    { field: "ship_to", headerName: "Ship To", width: 300 },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "240px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Pagination
        fetchData={fetchFulfillments}
        paging={{
          currentPage: page,
          totalPages: Math.ceil(itemCount / 50),
          totalCount: itemCount,
          pageSize: 50,
        }}
        withoutSearch
        onDataChange={fetchFulfillments}
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
      <Pagination
        fetchData={fetchFulfillments}
        paging={{
          currentPage: page,
          totalPages: Math.ceil(itemCount / 50),
          totalCount: itemCount,
          pageSize: 50,
        }}
        withoutSearch
        onDataChange={fetchFulfillments}
        showBackToTop
      />
    </Box>
  )
}

export default FulfillmentsTab
