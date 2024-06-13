import { Box, Button } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"

import { monthOptions } from "../../lib/constants"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"

import Pagination from "../../components/Pagination"
import ColorIndicator from "../../components/ColorIndicator"

const Shipments = ({
  shipments,
  loading,
  paging,
  allSubscriptions,
  setSelectedShipment,
  fetchShipments,
  handleClone,
}) => {
  const columns: GridColDef[] = [
    {
      field: "month",
      headerName: "Month",
      width: 120,
      align: "center",
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
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <div>
            {params.row.cycle || `${params.row.cycleRangeStart} - ${params.row.cycleRangeEnd}`}
          </div>
        )
      },
    },
    {
      field: "crystals",
      headerName: "Crystals",
      flex: 3,
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
                <Box sx={{ marginRight: "6px" }}>
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
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <Button onClick={(e) => handleClone(e, params.row.crystals)}>Clone</Button>
      },
    },
  ]

  return (
    <>
      <Pagination
        fetchData={fetchShipments}
        paging={paging}
        filterOptions={allSubscriptions.map((s) => {
          return {
            label: s.shortName,
            value: s.id,
          }
        })}
        withoutSearch
      />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
        }}
        rowHeight={120}
        rows={shipments || []}
        onRowClick={(params) => {
          setSelectedShipment(params.row as ShipmentT)
        }}
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
    </>
  )
}

export default Shipments
