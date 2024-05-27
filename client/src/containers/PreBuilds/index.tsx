import { useState, useEffect } from "react"
import { Box, Container } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"

import { useSubscriptionStore } from "../../store/subscriptionStore"

import { usePreBuildStore } from "../../store/preBuildStore"

import type { PreBuildT } from "../../types/PreBuild"
import type { CrystalT } from "../../types/Crystal"
import type { SubscriptionT } from "../../types/Subscription"

import UpdatePreBuildModal from "./UpdatePreBuildModal"
import Pagination from "../../components/Pagination"
import NewPreBuild from "./NewPreBuild"
import ColorIndicator from "../../components/ColorIndicator"

const PreBuilds = () => {
  const { paging, preBuilds, fetchPreBuilds } = usePreBuildStore()
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()

  const [selectedPrebuild, setSelectedPreBuild] = useState<PreBuildT>(null)

  useEffect(() => {
    fetchPreBuilds({})
    fetchSubscriptions()
  }, [])

  const columns: GridColDef[] = [
    {
      field: "cycle",
      headerName: "Cycle",
      width: 100,
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
  ]

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewPreBuild />
      {selectedPrebuild ? (
        <UpdatePreBuildModal
          preBuild={selectedPrebuild}
          setSelectedPreBuild={setSelectedPreBuild}
        />
      ) : null}
      <Pagination
        fetchData={fetchPreBuilds}
        paging={paging}
        filterOptions={subscriptions.map((s) => {
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
        rows={preBuilds || []}
        onRowClick={(item) => {
          setSelectedPreBuild(item.row)
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
