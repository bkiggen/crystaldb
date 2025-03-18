import { useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { callShipStationApi } from "../../api/shipstation"
import Pagination from "../../components/Pagination"
import { Box } from "@mui/material"

const CustomersTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [page, setPage] = useState(1)

  // Map ShipStation customers to DataGrid rows
  const mapCustomersToRows = (customers) =>
    customers.map((customer) => ({
      id: customer.customerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: `${customer.street1 || ""} ${customer.street2 || ""}, ${customer.city || ""} ${
        customer.state || ""
      } ${customer.postalCode || ""}`,
      tags: customer.tags?.map((tag) => tag.name).join(", ") || "N/A",
    }))

  const fetchCustomers = async (newData) => {
    setLoading(true)

    const newPage = newData.page || 1

    try {
      const response: any = await callShipStationApi({
        method: "GET",
        path: `/customers?page=${newPage}&pageSize=50`,
      })

      setPage(newPage)
      setRows(mapCustomersToRows(response.customers)) // Map customers to DataGrid rows
      setItemCount(response.total)
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 300 },
    { field: "tags", headerName: "Tags", width: 300 },
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
        fetchData={fetchCustomers}
        paging={{
          currentPage: page,
          totalPages: Math.ceil(itemCount / 50),
          totalCount: itemCount,
          pageSize: 50,
        }}
        withoutSearch
        onDataChange={fetchCustomers}
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
        fetchData={fetchCustomers}
        paging={{
          currentPage: page,
          totalPages: Math.ceil(itemCount / 50),
          totalCount: itemCount,
          pageSize: 50,
        }}
        withoutSearch
        onDataChange={fetchCustomers}
        showBackToTop
      />
    </Box>
  )
}

export default CustomersTab
