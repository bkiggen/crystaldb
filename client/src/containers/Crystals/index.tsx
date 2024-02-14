import React, { useState, useEffect } from "react"

import { Box, Container } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
// import dayjs from "dayjs"

import { getAllCrystals } from "../../api/crystals"
import type { CrystalT } from "../../types/Crystal"
import type { PagingT } from "../../types/Paging"
import ColorIndicator from "../../components/ColorIndicator"
import Pagination from "../../components/Pagination"

import NewCrystal from "./NewCrystal"
import { defaultPaging } from "../../types/Paging"

const Crystals = () => {
  const [crystals, setCrystals] = useState<CrystalT[] | null>(null)
  const [paging, setPaging] = useState<PagingT>(defaultPaging)

  const getCrystals = async ({ searchTerm = "", page = 1 }) => {
    const response = await getAllCrystals({ searchTerm, page })
    setCrystals(response.data || [])
    setPaging(response.paging)
  }

  useEffect(() => {
    getCrystals({ page: 1 })
  }, [])

  const addCrystal = (newCrystal: CrystalT) => {
    setCrystals((prevCrystals) => {
      if (prevCrystals) {
        return [...prevCrystals, newCrystal]
      }
      return null
    })
  }

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 300,
      flex: 3,
      renderCell: (params: GridCellParams) => {
        return <Box sx={{ textTransform: "capitalize" }}>{params.row.name}</Box>
      },
    },
    {
      field: "color",
      headerName: "Color",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ColorIndicator indicatorValue={params.row.color?.hex} />
          </Box>
        )
      },
    },
    {
      field: "size",
      headerName: "Size",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ textTransform: "capitalize" }}>{params.row.size}</Box>
          </Box>
        )
      },
    },
    {
      field: "inventory",
      headerName: "Inventory",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ColorIndicator indicatorType="inventory" indicatorValue={params.row.inventory} />
            {params.row.inventory}
          </Box>
        )
      },
    },
    {
      field: "rarity",
      headerName: "Rarity",
      width: 130,
      renderCell: (params: GridCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ColorIndicator indicatorType="rarity" indicatorValue={params.row.rarity} />
            {params.row.rarity}
          </Box>
        )
      },
    },
    {
      field: "findAge",
      headerName: "Find Age",
      width: 130,
      renderCell: (params: GridCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ColorIndicator indicatorType="findAge" indicatorValue={params.row.findAge} />
            {params.row.findAge}
          </Box>
        )
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params: GridCellParams) => {
        return <Box sx={{ textTransform: "capitalize" }}>{params.row.category}</Box>
      },
    },
  ]

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewCrystal addCrystal={addCrystal} />
      <Pagination fetchData={getCrystals} paging={paging} />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 800,
          },
        }}
        rows={crystals || []}
        columns={columns}
        disableColumnMenu
        disableColumnFilter
        hideFooter
        hideFooterPagination
        checkboxSelection={false}
        className="bg-white p-0"
        autoHeight
      />
    </Container>
  )
}

export default Crystals
