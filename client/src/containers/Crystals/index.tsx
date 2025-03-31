import { useState, useEffect, useRef } from "react"
import { Box, Checkbox, Container, Tooltip } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import { useCrystalStore } from "../../store/crystalStore"
import Pagination from "../../components/Pagination"
import SettingsIcon from "@mui/icons-material/Settings"
import ColorIndicator from "../../components/ColorIndicator"
import InventoryIndicator from "../../components/InventoryIndicator"
import NewCrystal from "./NewCrystal"
import UpdateCrystalModal from "./UpdateCrystalModal"
import FilterMenu from "../../components/SmartSelect/FilterMenu"
import { excludeFilters } from "../../components/SmartSelect/excludeFilters"
import colors from "../../styles/colors"
import UpdateOrDeleteModal from "../Shipments/UpdateOrDeletePopover"
import ConfirmDialogue from "../../components/ConfirmDialogue"

const Crystals = () => {
  const { fetchCrystals, deleteCrystal, crystals, paging } = useCrystalStore()

  const [activeFilters, setActiveFilters] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedCrystalIds, setSelectedCrystalIds] = useState<number[]>([])
  const [previouslyClickedRowId, setPreviouslyClickedRowId] = useState<number | null>(null)

  const settingsButtonRef = useRef(null)

  const getCrystals = async ({
    searchTerm = "",
    page = 1,
    pageSize = 50,
    sortBy = null,
    sortDirection = null,
  }) => {
    const excludedFilters = excludeFilters(activeFilters)

    fetchCrystals({ searchTerm, page, pageSize, sortBy, sortDirection, filters: excludedFilters })
  }

  const handleSelectAllClick = (e) => {
    setSelectAll(e.target.checked)
    if (e.target.checked) {
      setSelectedCrystalIds(crystals.map((crystal) => crystal.id)) // Select all crystal IDs
    } else {
      setSelectedCrystalIds([]) // Deselect all
    }
  }

  const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {
    if (params.field === "action") {
      event.stopPropagation()
    } else {
      setSelectedCrystalIds([params.row.id])
      setUpdateModalVisible(true)
    }
  }

  const clearSelected = () => {
    setDeleteModalVisible(false)
    setSelectedCrystalIds([])
    setUpdateModalVisible(false)
    setSelectAll(false)
  }

  const handleDelete = async () => {
    await selectedCrystalIds.forEach((id) => {
      deleteCrystal(id)
    })

    clearSelected()
  }

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>, params: GridCellParams) => {
    e.stopPropagation()
    const clickedId = params.row.id
    const shiftPressed =
      e.nativeEvent instanceof MouseEvent ? (e.nativeEvent as MouseEvent).shiftKey : false

    if (shiftPressed && previouslyClickedRowId !== null) {
      const visibleRowIds = crystals.map((s) => s.id) // Use visible order from props

      const startIndex = visibleRowIds.indexOf(previouslyClickedRowId)
      const endIndex = visibleRowIds.indexOf(clickedId)

      if (startIndex !== -1 && endIndex !== -1) {
        const [start, end] = [startIndex, endIndex].sort((a, b) => a - b)
        const rangeIds = visibleRowIds.slice(start, end + 1)

        const allSelected = rangeIds.every((id) => selectedCrystalIds.includes(id))

        if (allSelected) {
          setSelectedCrystalIds((prev) => prev.filter((id) => !rangeIds.includes(id)))
        } else {
          const newSelection = rangeIds.filter((id) => !selectedCrystalIds.includes(id))
          setSelectedCrystalIds((prev) => [...prev, ...newSelection])
        }
      }
    } else {
      setSelectedCrystalIds((prev) =>
        prev.includes(clickedId) ? prev.filter((id) => id !== clickedId) : [...prev, clickedId],
      )
    }

    setPreviouslyClickedRowId(clickedId)
  }

  useEffect(() => {
    getCrystals({})
  }, [])

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
              selectedCrystalIds.length > 0 && selectedCrystalIds.length < crystals.length
            }
            onChange={handleSelectAllClick}
          />
          {selectedCrystalIds.length > 0 && (
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
            checked={selectedCrystalIds.includes(params.row.id)}
          />
        )
      },
    },
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
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "240px",
        width: "90%",
        margin: "0 auto",
      }}
    >
      <NewCrystal />
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
          background: colors.slateA4,
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
        onCellClick={handleCellClick}
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
      <Pagination fetchData={getCrystals} paging={paging} withoutSearch showBackToTop />
      <ConfirmDialogue
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
      />
      {updateModalVisible ? (
        <UpdateCrystalModal
          selectedCrystals={crystals?.filter((crystal) => selectedCrystalIds.includes(crystal.id))}
          onClose={() => {
            setUpdateModalVisible(false)
          }}
        />
      ) : null}
    </Container>
  )
}

export default Crystals
