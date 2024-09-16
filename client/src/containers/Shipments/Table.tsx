import React, { useState } from "react"
import { Box, Button, Checkbox } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"

import { monthOptions } from "../../lib/constants"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"

import Pagination from "../../components/Pagination"
import ColorIndicator from "../../components/ColorIndicator"

import DeleteIcon from "@mui/icons-material/Delete"
import ConfirmDialogue from "../../components/ConfirmDialogue"
import { useShipmentStore } from "../../store/shipmentStore"

const Shipments = ({
  shipments,
  loading,
  paging,
  setSelectedShipment,
  fetchShipments,
  handleClone,
}) => {
  const { deleteShipments } = useShipmentStore()
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<number[]>([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectAll, setSelectAll] = useState(false)

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

  const commitDeleteShipments = () => {
    deleteShipments(selectedShipmentIds)
    setDeleteModalVisible(false)
    setSelectedShipmentIds([])
    setSelectAll(false)
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
            <DeleteIcon
              sx={{ color: "#cc0000", cursor: "pointer", marginRight: "8px" }}
              onClick={() => setDeleteModalVisible(true)}
            />
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
      field: "month",
      headerName: "Month",
      width: 120,
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
      width: 120,
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
      width: 150,
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
      width: 120,
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
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
              minWidth: "300px",
              flexWrap: "wrap",
            }}
          >
            {params.row.crystals?.map((crystal: CrystalT, idx) => (
              <Box
                key={crystal.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ColorIndicator indicatorValue={crystal.color?.hex} />
                <Box sx={{ marginRight: "6px", textTransform: "capitalize" }}>
                  {crystal.name}
                  {idx !== params.row.crystals.length - 1 ? "," : ""}
                </Box>
              </Box>
            ))}
          </Box>
        )
      },
    },
    {
      field: "clone",
      headerName: "Clone",
      width: 120,
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
      <Pagination fetchData={fetchShipments} paging={paging} withSubscriptionFilter withoutSearch />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
          cursor: "pointer",
          // pointer cursor on ALL rows
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        rowHeight={120}
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
        onConfirm={commitDeleteShipments}
      />
    </>
  )
}

export default Shipments
