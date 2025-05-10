import React, { useState, useRef } from "react"
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
import UpdateOrDeleteModal from "./UpdateOrDeletePopover"
import UpdateSelectedShipmentModal from "./UpdateSelectedShipmentModal"
import colors from "../../styles/colors"

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
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [selectAll, setSelectAll] = useState(false)

  const settingsButtonRef = useRef(null)

  const [previouslyClickedRowId, setPreviouslyClickedRowId] = useState<number | null>(null)

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>, params: GridCellParams) => {
    e.stopPropagation()
    const clickedId = params.row.id
    const shiftPressed =
      e.nativeEvent instanceof MouseEvent ? (e.nativeEvent as MouseEvent).shiftKey : false

    if (shiftPressed && previouslyClickedRowId !== null) {
      const visibleRowIds = shipments.map((s) => s.id) // Use visible order from props

      const startIndex = visibleRowIds.indexOf(previouslyClickedRowId)
      const endIndex = visibleRowIds.indexOf(clickedId)

      if (startIndex !== -1 && endIndex !== -1) {
        const [start, end] = [startIndex, endIndex].sort((a, b) => a - b)
        const rangeIds = visibleRowIds.slice(start, end + 1)

        const allSelected = rangeIds.every((id) => selectedShipmentIds.includes(id))

        if (allSelected) {
          setSelectedShipmentIds((prev) => prev.filter((id) => !rangeIds.includes(id)))
        } else {
          const newSelection = rangeIds.filter((id) => !selectedShipmentIds.includes(id))
          setSelectedShipmentIds((prev) => [...prev, ...newSelection])
        }
      }
    } else {
      setSelectedShipmentIds((prev) =>
        prev.includes(clickedId) ? prev.filter((id) => id !== clickedId) : [...prev, clickedId],
      )
    }

    setPreviouslyClickedRowId(clickedId)
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

  const clearSelected = () => {
    setDeleteModalVisible(false)
    setSelectedShipmentIds([])
    setSelectAll(false)
  }

  const handleDelete = () => {
    deleteShipments({ shipmentIdArr: selectedShipmentIds, isBulkDelete: false })
    clearSelected()
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
                setConfirmDelete={() => setDeleteModalVisible(true)}
                setConfirmUpdate={() => setUpdateModalVisible(true)}
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
            onChange={(e) => handleCheckboxClick(e, params)}
            checked={selectedShipmentIds.includes(params.row.id)}
          />
        )
      },
    },
    {
      field: "groupLabel",
      headerName: "Group Label",
      width: 150,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <Box sx={{ textAlign: "center" }}>{params.row.groupLabel}</Box>
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
      <Pagination
        fetchData={(args) => {
          fetchShipments(args)
          clearSelected()
        }}
        loading={loading}
        paging={paging}
        withSubscriptionFilter
        onDataChange={onPaginationDataFetch}
      />
      <DataGrid
        sx={{
          background: colors.slateA4,
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
        disableColumnMenu
        disableColumnFilter
        hideFooter
        hideFooterPagination
        checkboxSelection={false}
        className="bg-white p-0"
        autoHeight
      />
      <Pagination
        fetchData={(args) => {
          fetchShipments(args)
          clearSelected()
        }}
        loading={loading}
        paging={paging}
        withoutSearch
        showBackToTop
        onDataChange={onPaginationDataFetch}
      />
      <ConfirmDialogue
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
      />
      {updateModalVisible && (
        <UpdateSelectedShipmentModal
          selectedShipmentIds={selectedShipmentIds}
          onModalClose={() => {
            setUpdateModalVisible(false)
          }}
          resetSelectedShipmentIds={() => {
            clearSelected()
          }}
        />
      )}
    </Box>
  )
}

export default ShipmentsTable
