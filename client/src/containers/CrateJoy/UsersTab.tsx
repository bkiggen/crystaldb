import { useState } from "react"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { callCratejoyApi } from "../../api/cratejoy"
import Pagination from "../../components/Pagination"
import UpdateUserModal from "./UpdateUserModal"
import { Button } from "@mui/material"

const UsersTab = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [page, setPage] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false)

  const fetchCustomers = async (newData) => {
    setLoading(true)

    const newPage = newData.page
    try {
      const response: any = await callCratejoyApi({
        method: "GET",
        path: `/customers?page=${newPage}`,
      })

      setPage(newPage)
      setRows(response.results)
      setItemCount(response.count)
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "country", headerName: "Country", width: 100 },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
    },
    { field: "total_revenue", headerName: "Total Revenue", width: 150 },
    { field: "subscription_status", headerName: "Subscription Status", width: 150 },
  ]

  const pageSize = 10

  return (
    <div style={{ height: 600, width: "100%" }}>
      <Pagination
        fetchData={fetchCustomers}
        paging={{
          currentPage: page,
          totalPages: Math.ceil(itemCount / pageSize),
          totalCount: itemCount,
          pageSize: pageSize,
        }}
        filterContent={
          <Button onClick={() => setUpdateUserModalOpen(true)} variant="contained">
            Search By ID
          </Button>
        }
        withoutSearch
        onDataChange={fetchCustomers}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={(data) => {
          setSelectedUser(data.row)
          setUpdateUserModalOpen(true)
        }}
        disableColumnMenu
        disableColumnFilter
        hideFooter
        hideFooterPagination
        sx={{ background: "rgba(70, 90, 126, 0.4)", color: "white" }}
        autoHeight
      />
      {updateUserModalOpen && (
        <UpdateUserModal
          user={selectedUser}
          open={!!updateUserModalOpen}
          onClose={() => {
            setSelectedUser(null)
            setUpdateUserModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default UsersTab
