import { useState, useEffect } from "react"
// import { useNavigate, useLocation } from "react-router-dom"

import { Box, Container, Tooltip } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"

import { useCrystalStore } from "../../store/crystalStore"
import type { CrystalT } from "../../types/Crystal"

import Pagination from "../../components/Pagination"
import ColorIndicator from "../../components/ColorIndicator"
import InventoryIndicator from "../../components/InventoryIndicator"
import NewCrystal from "./NewCrystal"
import UpdateCrystalModal from "./UpdateCrystalModal"
import FilterMenu from "../../components/SmartSelect/FilterMenu"
import { excludeFilters } from "../../components/SmartSelect/excludeFilters"

const Crystals = () => {
  const { fetchCrystals, crystals, paging } = useCrystalStore()

  const [activeFilters, setActiveFilters] = useState({})

  const [crystalToUpdate, setCrystalToUpdate] = useState<CrystalT>(null)

  const getCrystals = async ({
    searchTerm = "",
    page = 1,
    sortBy = null,
    sortDirection = null,
  }) => {
    const excludedFilters = excludeFilters(activeFilters)

    fetchCrystals({ searchTerm, page, sortBy, sortDirection, filters: excludedFilters })
  }

  useEffect(() => {
    getCrystals({})
  }, [])

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 300,
      flex: 3,
      sortable: false,
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
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Tooltip title={params.row.color?.name}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ColorIndicator indicatorValue={params.row.color?.hex} />
            </Box>
          </Tooltip>
        )
      },
    },
    {
      field: "inventory",
      headerName: "Inventory",
      width: 150,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InventoryIndicator indicatorValue={params.row.inventory} />
            {params.row.inventory}
          </Box>
        )
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <Box sx={{ textTransform: "capitalize" }}>{params.row.category?.name}</Box>
      },
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <Box sx={{ textTransform: "capitalize" }}>{params.row.location?.name}</Box>
      },
    },
  ]

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewCrystal />
      {crystalToUpdate ? (
        <UpdateCrystalModal
          listCrystal={crystalToUpdate}
          onClose={() => setCrystalToUpdate(null)}
        />
      ) : null}
      <Pagination
        fetchData={getCrystals}
        paging={paging}
        filterContent={
          <FilterMenu
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            defaultFilteredOut={{}}
            fetchCrystals={getCrystals}
          />
        }
      />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 800,
          },
          "& .MuiDataGrid-iconButtonContainer": {
            display: "none",
          },
          // pointer cursor on ALL rows
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        // sortingMode="server"
        // sortModel={sortModel}
        // onSortModelChange={(model) => {
        //   if (model.length !== 0) {
        //     const sortArgs = { sortBy: model[0]?.field, sortDirection: model[0]?.sort }
        //     setSortModel(model)
        //     getCrystals(sortArgs)
        //     navigate(
        //       `${location.pathname}?sortBy=${model[0]?.field}&sortDirection=${model[0]?.sort}`,
        //     )
        //   }
        // }}
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
