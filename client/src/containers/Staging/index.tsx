import { useState, useEffect } from "react"
import { Box, Container, Checkbox } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef, useGridApiRef } from "@mui/x-data-grid"
import { usePreBuildStore } from "../../store/preBuildStore"
import BuildIcon from "@mui/icons-material/Build"
import type { PreBuildT } from "../../types/PreBuild"
import type { CrystalT } from "../../types/Crystal"
import UpdatePreBuildModal from "./UpdatePreBuildModal"
import Pagination from "../../components/Pagination"
import { useSubscriptionStore } from "../../store/subscriptionStore"
import { useShipmentStore } from "../../store/shipmentStore"
import dayjs from "dayjs"
import { truncateCommaList } from "../../util/truncateCommaList"
import BuildPrebuildModal from "./BuildPrebuildModal"
import CrystalChip from "../../components/SmartSelect/CrystalChip"
import NewStage from "./NewStage"
import colors from "../../styles/colors"

const Staging = () => {
  const { paging, preBuilds, fetchPreBuilds, badPrebuilds, loading, conflictingCyclePrebuilds } =
    usePreBuildStore()
  const { fetchSubscriptions } = useSubscriptionStore()
  const { createShipment } = useShipmentStore()
  const [selectAll, setSelectAll] = useState(false)
  const [selectedPrebuilds, setSelectedPreBuilds] = useState<PreBuildT[]>([])
  const [highlightedPrebuilds, setHighlightedPrebuilds] = useState<PreBuildT[]>([])
  const [previouslyClickedRowId, setPreviouslyClickedRowId] = useState<number>(null)
  const [buildModalVisible, setBuildModalVisible] = useState(false)
  const [month, setMonth] = useState(dayjs().month() + 1)
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

  const apiRef = useGridApiRef()
  const handleCheckboxClick = (e, params) => {
    e.stopPropagation()
    const clickedId = params.row.id
    const shiftPressed =
      e.nativeEvent instanceof MouseEvent ? (e.nativeEvent as MouseEvent).shiftKey : false

    if (shiftPressed && previouslyClickedRowId !== null) {
      const visibleRowIds = apiRef.current.getSortedRowIds() // Gives current visual order

      const startIndex = visibleRowIds.indexOf(previouslyClickedRowId)
      const endIndex = visibleRowIds.indexOf(clickedId)

      if (startIndex !== -1 && endIndex !== -1) {
        const [start, end] = [startIndex, endIndex].sort((a, b) => a - b)
        const rangeIds = visibleRowIds.slice(start, end + 1)
        const rangePrebuilds = preBuilds.filter((p) => rangeIds.includes(p.id))

        const allSelected = rangePrebuilds.every((p) =>
          highlightedPrebuilds.some((hp) => hp.id === p.id),
        )

        if (allSelected) {
          // Deselect the whole range
          setHighlightedPrebuilds((prev) => prev.filter((p) => !rangeIds.includes(p.id)))
        } else {
          // Add any not already selected
          setHighlightedPrebuilds((prev) => {
            const newOnes = rangePrebuilds.filter((p) => !prev.some((hp) => hp.id === p.id))
            return [...prev, ...newOnes]
          })
        }
      }
    } else {
      const isSelected = highlightedPrebuilds.some((p) => p.id === clickedId)
      if (isSelected) {
        setHighlightedPrebuilds((prev) => prev.filter((p) => p.id !== clickedId))
      } else {
        const selectedRow = preBuilds.find((p) => p.id === clickedId)
        if (selectedRow) setHighlightedPrebuilds((prev) => [...prev, selectedRow])
      }
    }

    setPreviouslyClickedRowId(clickedId)
  }

  const confirmBuildPrebuilds = () => {
    highlightedPrebuilds.forEach((prebuild) => {
      const subscriptionId = prebuild.subscription.id
      const crystalIds = prebuild.crystals.map((crystal) => crystal.id)

      // Call createShipment with the collected data
      createShipment({
        cycleString: prebuild.cycle,
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

  const styleOptions = (isBadCrystal, isOutInventory) => {
    if (isBadCrystal) {
      return {
        borderColor: "red",
        borderWidth: "2px",
      }
    } else if (isOutInventory) {
      return {
        borderColor: "orange",
        borderWidth: "2px",
      }
    } else {
      return {
        borderColor: "white",
        borderWidth: "1px",
      }
    }
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
      flex: 1,
      align: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        const conflicts = conflictingCyclePrebuilds.find((ccp) => ccp.id === params.row.id)
        const badCrystalObject = badPrebuilds.find((bp) => bp.id === params.row.id)
        const barredCrystals = badCrystalObject?.barredCrystalIds
        const outCrystals = badCrystalObject?.outInventoryCrystalIds

        return (
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
            {truncateCommaList(params.row.cycle)}
            {(badCrystalObject || conflicts) && (
              <ul style={{ textAlign: "left" }}>
                {conflicts && (
                  <li style={{ color: "blueviolet", fontSize: "12px" }}>
                    Cycle overlaps with other row(s)
                  </li>
                )}
                {barredCrystals && (
                  <li style={{ color: "red", fontSize: "12px" }}>Previously Used</li>
                )}
                {outCrystals && <li style={{ color: "red", fontSize: "12px" }}>Out Inventory</li>}
              </ul>
            )}
          </Box>
        )
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
        const badCrystalObject = badPrebuilds.find((bp) => bp.id === params.row.id)
        const barredCrystals = badCrystalObject?.barredCrystalIds || []
        const outCrystals = badCrystalObject?.outInventoryCrystalIds || []
        const somethingWrong = barredCrystals.length > 0 || outCrystals.length > 0
        const styles = styleOptions(barredCrystals.length, outCrystals.length)

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
                <CrystalChip
                  key={idx}
                  crystal={crystal}
                  withoutDelete
                  fontSize="12px"
                  chipStyles={
                    somethingWrong
                      ? {
                          color: "white",
                          borderColor: styles.borderColor,
                          borderWidth: styles.borderWidth,
                          textTransform: "capitalize",
                        }
                      : {}
                  }
                />
              ))}
            </Box>
          </Box>
        )
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
      <NewStage
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        fetchPreBuilds={fetchPreBuilds}
      />
      {selectedPrebuilds.length === 1 && (
        <UpdatePreBuildModal
          preBuild={selectedPrebuilds[0]}
          setSelectedPreBuild={setSelectedPreBuilds}
        />
      )}
      <Pagination
        fetchData={fetchPreBuilds}
        paging={paging}
        withSubscriptionFilter
        hideMonthYear
        loading={loading}
      />
      <DataGrid
        sx={{
          background: colors.slateA4,
          color: "white",
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
          "& .red": {
            backgroundColor: "rgba(255, 0, 0, 0.1)", // Light red background for bad rows
            border: "1px solid red", // Red outline
          },
          "& .purple": {
            backgroundColor: "rgba(128, 0, 128, 0.1)", // Light purple background for conflicting cycle rows
            border: "1px solid purple", // Purple outline
          },
        }}
        apiRef={apiRef}
        rows={preBuilds || []}
        getRowHeight={() => "auto"}
        getRowClassName={(params) => {
          const rowId = typeof params.id === "string" ? parseInt(params.id, 10) : params.id

          if (conflictingCyclePrebuilds.some((ccp) => rowId === ccp.id)) {
            return "purple"
          }

          if (badPrebuilds.some((bp) => bp.id === params.row.id)) {
            return "red"
          }

          return ""
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
      <Pagination
        fetchData={fetchPreBuilds}
        paging={paging}
        withoutSearch
        showBackToTop
        loading={loading}
      />
    </Container>
  )
}

export default Staging
