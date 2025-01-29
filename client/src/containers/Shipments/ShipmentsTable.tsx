import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Button, Checkbox } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"

import { monthOptions } from "../../lib/constants"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"

import Pagination from "../../components/Pagination"

import SettingsIcon from "@mui/icons-material/Settings"
import ConfirmDialogue from "../../components/ConfirmDialogue"
import { useShipmentStore } from "../../store/shipmentStore"
import CrystalChip from "../../components/SmartSelect/CrystalChip"
import UpdateOrDeleteModal from "./UpdateOrDeleteModal"

const ShipmentsTable = ({
  shipments,
  loading,
  paging,
  setSelectedShipment,
  fetchShipments,
  handleClone,
}) => {
  const navigate = useNavigate()
  const { deleteShipments } = useShipmentStore()
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<number[]>([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectAll, setSelectAll] = useState(false)

  const settingsButtonRef = React.useRef(null)

  const handleClick = (e, params: GridCellParams) => {
    e.stopPropagation()
    setSelectedShipmentIds((prev) => {
      if (prev.includes(params.row.id)) {
        return prev.filter((id) => id !== params.row.id)
      } else {
        return [...prev, params.row.id]
      }
    })
  }

  const handleSelectAllClick = (e) => {
    setSelectAll(e.target.checked)
    if (e.target.checked) {
      setSelectedShipmentIds(shipments.map((shipment) => shipment.id)) // Select all shipment IDs
    } else {
      setSelectedShipmentIds([]) // Deselect all
    }
  }

  const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {
    if (params.field === "action") {
      event.stopPropagation()
    } else {
      setSelectedShipment(params.row as ShipmentT)
    }
  }

  const handleUpdateOrDelete = (actionType: "update" | "delete") => {
    if (actionType === "update") {
      // updateShipment(selectedShipmentIds[0])
    } else {
      deleteShipments({ shipmentIdArr: selectedShipmentIds, isBulkDelete: false })
    }

    setDeleteModalVisible(false)
    setSelectedShipmentIds([])
    setSelectAll(false)
  }

  const onPaginationDataFetch = (pagingData) => {
    const queryParams = new URLSearchParams()

    queryParams.append("page", pagingData.page)

    if (pagingData.searchTerm) {
      queryParams.append("searchTerm", pagingData.searchTerm)
    }

    navigate(`?${queryParams.toString()}`)
  }

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      width: 100,
      align: "center",
      sortable: false,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={selectAll}
            indeterminate={
              selectedShipmentIds.length > 0 && selectedShipmentIds.length < shipments.length
            }
            onChange={handleSelectAllClick}
          />
          {selectedShipmentIds.length > 0 && (
            <>
              <SettingsIcon
                sx={{ cursor: "pointer", marginRight: "8px" }}
                onClick={() => setConfirmOpen(true)}
                ref={settingsButtonRef}
              />
              <UpdateOrDeleteModal
                open={confirmOpen}
                onClose={() => {
                  setConfirmOpen(null)
                }}
                onConfirm={handleUpdateOrDelete}
                buttonRef={settingsButtonRef}
              />
            </>
          )}
        </Box>
      ),
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Checkbox
            onChange={(e) => handleClick(e, params)}
            checked={selectedShipmentIds.includes(params.row.id)}
          />
        )
      },
    },
    {
      field: "groupLabel",
      headerName: "Group Label",
      width: 100,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.groupLabel}</div>
      },
    },
    {
      field: "month",
      headerName: "Month",
      width: 100,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{monthOptions[params.row.month]?.short}</div>
      },
    },
    {
      field: "year",
      headerName: "Year",
      width: 100,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.year}</div>
      },
    },
    {
      field: "subscriptionType",
      headerName: "Subscription Type",
      width: 140,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.subscription?.shortName}</div>
      },
    },
    {
      field: "cycle",
      headerName: "Cycle",
      width: 100,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.cycle}</div>
      },
    },
    {
      field: "crystals",
      headerName: "Crystals",
      flex: 3,
      minWidth: 300,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Box
            sx={{ minHeight: "100px", display: "flex", alignItems: "center", padding: "12px 0" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minWidth: "300px",
                flexWrap: "wrap",
                height: "100%",
              }}
            >
              {params.row.crystals?.map((crystal: CrystalT, idx) => (
                <CrystalChip key={idx} crystal={crystal} withoutDelete fontSize="12px" />
              ))}
            </Box>
          </Box>
        )
      },
    },
    {
      field: "clone",
      headerName: "Clone",
      width: 100,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleClone(e, params.row.crystals)
            }}
          >
            Clone
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <Pagination
        fetchData={fetchShipments}
        paging={paging}
        withSubscriptionFilter
        onDataChange={onPaginationDataFetch}
      />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
          cursor: "pointer",

          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        getRowHeight={() => "auto"}
        rows={shipments || []}
        onCellClick={handleCellClick}
        columns={columns}
        loading={loading}
        disableColumnMenu
        disableColumnFilter
        hideFooter
        hideFooterPagination
        checkboxSelection={false}
        className="bg-white p-0"
        autoHeight
      />

      <ConfirmDialogue
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleUpdateOrDelete}
      />
    </>
  )
}

export default ShipmentsTable
