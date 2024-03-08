import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import { Box, Container, Tooltip } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef, GridSortModel } from "@mui/x-data-grid"

import { getAllCrystals } from "../../api/crystals"
import type { CrystalT } from "../../types/Crystal"
import type { PagingT } from "../../types/Paging"
import { defaultPaging } from "../../types/Paging"

import Pagination from "../../components/Pagination"
import ColorIndicator from "../../components/ColorIndicator"
import NewCrystal from "./NewCrystal"
import UpdateCrystalModal from "./UpdateCrystalModal"

const Crystals = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [crystals, setCrystals] = useState<CrystalT[] | null>(null)
  const [paging, setPaging] = useState<PagingT>(defaultPaging)
  const [crystalToUpdate, setCrystalToUpdate] = useState<CrystalT>(null)
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "commodity", sort: "asc" }])

  const getCrystals = async ({
    searchTerm = "",
    page = 1,
    sortBy = null,
    sortDirection = null,
  }) => {
    const response = await getAllCrystals({ searchTerm, page, sortBy, sortDirection })
    setCrystals(response.data || [])
    setPaging(response.paging)
  }

  useEffect(() => {
    getCrystals({})
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
        return (
          <Tooltip title={params.row.description}>
            <Box sx={{ textTransform: "capitalize" }}>{params.row.name}</Box>
          </Tooltip>
        )
      },
    },
    {
      field: "color",
      headerName: "Color",
      width: 80,
      align: "center",
      sortable: false,
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
        return params.row.size ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ textTransform: "capitalize" }}>{params.row.size}</Box>
          </Box>
        ) : (
          <Box>-</Box>
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
        return params.row.rarity ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ColorIndicator indicatorType="rarity" indicatorValue={params.row.rarity} />
            {params.row.rarity}
          </Box>
        ) : (
          <Box>-</Box>
        )
      },
    },
    {
      field: "findAge",
      headerName: "Find Age",
      width: 130,
      renderCell: (params: GridCellParams) => {
        return params.row.findAge ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ColorIndicator indicatorType="findAge" indicatorValue={params.row.findAge} />
            {params.row.findAge}
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>-</Box>
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
      {crystalToUpdate ? (
        <UpdateCrystalModal
          crystal={crystalToUpdate}
          onClose={() => setCrystalToUpdate(null)}
          refreshCrystals={() => getCrystals({})}
        />
      ) : null}
      <Pagination fetchData={getCrystals} paging={paging} />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 800,
          },
        }}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(model) => {
          if (model.length !== 0) {
            const sortArgs = { sortBy: model[0]?.field, sortDirection: model[0]?.sort }
            setSortModel(model)
            getCrystals(sortArgs)
            navigate(
              `${location.pathname}?sortBy=${model[0]?.field}&sortDirection=${model[0]?.sort}`,
            )
          }
        }}
        onRowClick={(item) => setCrystalToUpdate(item.row)}
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
