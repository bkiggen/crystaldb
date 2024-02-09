import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"

import { monthOptions } from "../../lib/constants"
import { getAllShipments } from "../../api/shipments"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"

import NewShipment from "./NewShipment"

const Shipments = () => {
  const [shipments, setShipments] = useState<ShipmentT[] | null>(null)

  useEffect(() => {
    const fetchShipments = async () => {
      const response = await getAllShipments()
      setShipments(response)
    }
    fetchShipments()
  }, [])

  const addShipment = (newShipment: ShipmentT) => {
    setShipments((prevShipments) => {
      if (prevShipments) {
        return [...prevShipments, newShipment]
      }
      return null
    })
  }

  const columns: GridColDef[] = [
    {
      field: "year",
      headerName: "Year",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.year}</div>
      },
    },
    {
      field: "month",
      headerName: "Month",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return <div>{monthOptions[params.row.month]?.short}</div>
      },
    },
    {
      field: "subscriptionType",
      headerName: "Subscription Type",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.subscription?.shortName}</div>
      },
    },
    {
      field: "cycle",
      headerName: "Cycle",
      width: 150,
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
                {crystal.color?.hex ? (
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: crystal.color?.hex,
                    }}
                  />
                ) : null}
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
  ]

  return (
    <Box sx={{ paddingBottom: "240px" }}>
      <NewShipment addShipment={addShipment} />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          sx={{
            background: "rgba(70, 90, 126, 0.4)",
            color: "white",
            maxWidth: "1200px",
            width: "90%",
            margin: "0 auto",
          }}
          rowHeight={120}
          rows={shipments || []}
          columns={columns}
          disableColumnMenu
          disableColumnFilter
          hideFooter
          hideFooterPagination
          checkboxSelection={false}
          className="bg-white p-0"
          autoHeight
        />
      </div>
    </Box>
  )
}

export default Shipments
