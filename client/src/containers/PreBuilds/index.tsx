import { useState, useEffect } from "react"
import { Box, Container, Checkbox } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import { usePreBuildStore } from "../../store/preBuildStore"
import BuildIcon from "@mui/icons-material/Build"
import type { PreBuildT } from "../../types/PreBuild"
import type { CrystalT } from "../../types/Crystal"
import UpdatePreBuildModal from "./UpdatePreBuildModal"
import Pagination from "../../components/Pagination"
import NewPreBuild from "./NewPreBuild"
import { useSubscriptionStore } from "../../store/subscriptionStore"
import { useShipmentStore } from "../../store/shipmentStore"
import dayjs from "dayjs"
import BuildPrebuildModal from "./BuildPrebuildModal"
import CrystalChip from "../../components/SmartSelect/CrystalChip"

const PreBuilds = () => {
  const { paging, preBuilds, fetchPreBuilds, badPrebuildIds } = usePreBuildStore()
  const { fetchSubscriptions } = useSubscriptionStore()
  const { createShipment } = useShipmentStore()

  const [selectAll, setSelectAll] = useState(false)
  const [selectedPrebuilds, setSelectedPreBuilds] = useState<PreBuildT[]>([])
  const [highlightedPrebuilds, setHighlightedPrebuilds] = useState<PreBuildT[]>([])
  const [buildModalVisible, setBuildModalVisible] = useState(false)
  const [month, setMonth] = useState(dayjs().month())
  const [year, setYear] = useState(dayjs().year())

  useEffect(() => {
    fetchPreBuilds({})
    fetchSubscriptions()
  }, [])

  const handleSelectAllClick = (e) => {
    setSelectAll(e.target.checked)
    if (e.target.checked) {
      setHighlightedPrebuilds(preBuilds)
    } else {
      setHighlightedPrebuilds([])
    }
  }

  const handleCheckboxClick = (e, params) => {
    e.stopPropagation()
    const selectedId = params.row.id
    // add or remove from selectedPrebuilds
    setHighlightedPrebuilds((prevSelected) =>
      prevSelected.some((prebuild) => prebuild.id === selectedId)
        ? prevSelected.filter((prebuild) => prebuild.id !== selectedId)
        : [...prevSelected, preBuilds.find((prebuild) => prebuild.id === selectedId)],
    )
  }

  const confirmBuildPrebuilds = () => {
    highlightedPrebuilds.forEach((prebuild) => {
      const subscriptionId = prebuild.subscription.id
      const crystalIds = prebuild.crystals.map((crystal) => crystal.id)

      // Call createShipment with the collected data
      createShipment({
        cycleString: prebuild.cycle.toString(),
        subscriptionId,
        crystalIds,
        month,
        year,
        userCount: 0,
        userCountIsNew: false,
      })
    })

    // Close modal and reset state
    setBuildModalVisible(false)
    setHighlightedPrebuilds([])
    setSelectAll(false)
  }

  const handleRowClick = (item, event) => {
    if (event.target.type === "checkbox") {
      return
    }

    const id = item.row.id
    setSelectedPreBuilds((prevSelected) =>
      prevSelected.some((prebuild) => prebuild.id === id)
        ? prevSelected.filter((prebuild) => prebuild.id !== id)
        : [...prevSelected, preBuilds.find((prebuild) => prebuild.id === id)],
    )
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
          {highlightedPrebuilds.length > 0 && (
            <BuildIcon
              sx={{ cursor: "pointer", marginRight: "8px" }}
              onClick={() => setBuildModalVisible(true)}
            />
          )}
        </Box>
      ),
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Checkbox
            onChange={(e) => handleCheckboxClick(e, params)}
            checked={highlightedPrebuilds.filter((sp) => sp.id === params.row.id).length > 0}
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
  ]

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewPreBuild />
      {selectedPrebuilds.length === 1 && (
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
          "& .bad-row": {
            backgroundColor: "rgba(255, 0, 0, 0.1)", // Light red background for bad rows
            border: "1px solid red", // Red outline
          },
        }}
        rows={preBuilds || []}
        getRowHeight={() => "auto"}
        getRowClassName={(params) => {
          const rowId = typeof params.id === "string" ? parseInt(params.id, 10) : params.id
          return badPrebuildIds.includes(rowId) ? "bad-row" : ""
        }}
        onRowClick={handleRowClick}
        columns={columns}
        disableColumnMenu
        disableColumnFilter
        hideFooter
        hideFooterPagination
        checkboxSelection={false}
        className="bg-white p-0"
        autoHeight
      />
      <BuildPrebuildModal
        buildModalVisible={buildModalVisible}
        setBuildModalVisible={setBuildModalVisible}
        highlightedPrebuilds={highlightedPrebuilds}
        month={month}
        setMonth={setMonth}
        setYear={setYear}
        year={year}
        confirmBuildPrebuilds={confirmBuildPrebuilds}
      />
    </Container>
  )
}

export default PreBuilds
