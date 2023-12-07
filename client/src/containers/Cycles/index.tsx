import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import dayjs from "dayjs"

import { months } from "../../lib/constants"
import { getAllCycles } from "../../graphql/cycles"

import type { CycleT } from "../../types/Cycle"
import type { CrystalT } from "../../types/Crystal"

import NewCycle from "./NewCycle"

const Cycles = () => {
  const [cycles, setCycles] = useState<CycleT[] | null>(null)

  useEffect(() => {
    const fetchCycles = async () => {
      const response = await getAllCycles()
      setCycles(response)
    }
    fetchCycles()
  }, [])

  const addCycle = (newCycle: CycleT) => {
    setCycles((prevCycles) => {
      if (prevCycles) {
        return [...prevCycles, newCycle]
      }
      return null
    })
  }

  const columns: GridColDef[] = [
    {
      field: "month",
      headerName: "Shipment Month",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return <div>{months[params.row.month]}</div>
      },
    },
    {
      field: "week",
      headerName: "Subscriber Cycle",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.week}</div>
      },
    },
    {
      field: "crystals",
      headerName: "Crystals",
      width: 300,
      flex: 3,
      renderCell: (params: GridCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            {params.row.crystals?.map((crystal: CrystalT) => (
              <Box
                key={crystal.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "24px",
                }}
              >
                <Box
                  sx={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: crystal.color?.hex,
                    marginRight: "8px",
                  }}
                />
                <div>{crystal.name}</div>
              </Box>
            ))}
          </Box>
        )
      },
    },
  ]

  return (
    <Box sx={{ paddingBottom: "240px" }}>
      <NewCycle addCycle={addCycle} />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          sx={{
            background: "rgba(70, 90, 126, 0.4)",
            color: "white",
            maxWidth: "1200px",
            width: "90%",
            margin: "0 auto",
          }}
          rows={cycles || []}
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

export default Cycles
