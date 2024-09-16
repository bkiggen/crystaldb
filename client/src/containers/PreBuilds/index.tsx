import { useState, useEffect } from "react"
import { Box, Container, Checkbox } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import { usePreBuildStore } from "../../store/preBuildStore"

import type { PreBuildT } from "../../types/PreBuild"
import type { CrystalT } from "../../types/Crystal"

import UpdatePreBuildModal from "./UpdatePreBuildModal"
import Pagination from "../../components/Pagination"
import NewPreBuild from "./NewPreBuild"
import ColorIndicator from "../../components/ColorIndicator"
import { useSubscriptionStore } from "../../store/subscriptionStore"

const PreBuilds = () => {
  const { paging, preBuilds, fetchPreBuilds } = usePreBuildStore()
  const { fetchSubscriptions } = useSubscriptionStore()

  const [selectAll, setSelectAll] = useState(false)
  const [selectedPrebuilds, setSelectedPreBuilds] = useState<PreBuildT[]>([])

  useEffect(() => {
    fetchPreBuilds({})
    fetchSubscriptions()
  }, [])

  const handleSelectAllClick = (e) => {
    setSelectAll(e.target.checked)
    if (e.target.checked) {
      // Select all prebuilds
      setSelectedPreBuilds(preBuilds)
    } else {
      // Deselect all prebuilds
      setSelectedPreBuilds([])
    }
  }

  const handleClick = (e, params) => {
    e.stopPropagation()
    const selectedId = params.row.id
    setSelectedPreBuilds((prevSelected) => {
      if (prevSelected.some((prebuild) => prebuild.id === selectedId)) {
        // If the prebuild with selectedId is already in the selected array, remove it
        return prevSelected.filter((prebuild) => prebuild.id !== selectedId)
      } else {
        // If not, add the corresponding prebuild to the selected array
        const selectedPrebuild = preBuilds.find((prebuild) => prebuild.id === selectedId)
        return [...prevSelected, selectedPrebuild]
      }
    })
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
          <Checkbox checked={selectAll} onChange={handleSelectAllClick} />
        </Box>
      ),
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Checkbox
            onChange={(e) => handleClick(e, params)}
            checked={selectedPrebuilds.filter((sp) => sp.id === params.row.id).length > 0}
          />
        )
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
      field: "crystals",
      headerName: "Crystals",
      sortable: false,
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
  ]

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewPreBuild />
      {selectedPrebuilds.length === 1 && ( // Check if any prebuilds are selected
        <UpdatePreBuildModal
          preBuild={selectedPrebuilds[0]}
          setSelectedPreBuild={setSelectedPreBuilds}
        />
      )}
      <Pagination fetchData={fetchPreBuilds} paging={paging} withSubscriptionFilter withoutSearch />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        rowHeight={120}
        rows={preBuilds || []}
        onRowClick={(item) => {
          const id = item.row.id
          setSelectedPreBuilds((prevSelected) =>
            prevSelected.includes(id)
              ? prevSelected.filter((prebuildId) => prebuildId !== id)
              : [...prevSelected, id],
          )
        }}
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

export default PreBuilds
