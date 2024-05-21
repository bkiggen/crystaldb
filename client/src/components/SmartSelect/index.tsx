import { useState } from "react"

import { useFormik } from "formik"

import { Box, Typography } from "@mui/material"
import LoopIcon from "@mui/icons-material/Loop"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

import { getSuggestedCrystals } from "../../api/crystals"

// import useCrystalFilterOptions from "../../hooks/useCrystalFilterOptions"

import { useCrystalStore } from "../../store/crystalStore"

import CrystalChip from "./CrystalChip"
import FilterMenu from "./FilterMenu"

type SmartSelectT = {
  formik: ReturnType<typeof useFormik>
  cycleRangeMode: boolean
}

const SmartSelect = ({ formik, cycleRangeMode }: SmartSelectT) => {
  const { suggestedCrystals } = useCrystalStore()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [excludedCrystalIds, setExcludedCrystalIds] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const crystals = suggestedCrystals.filter((crystal) => {
    return !excludedCrystalIds.includes(crystal.id)
  })

  const pagedCrystals = crystals.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updatePage = (direction: "left" | "right") => {
    if (direction === "left") {
      if (currentPage === 1) {
        setCurrentPage(crystals.length)
      } else {
        setCurrentPage(currentPage - 1)
      }
    } else {
      if (currentPage === crystals.length) {
        setCurrentPage(1)
      } else {
        setCurrentPage(currentPage + 1)
      }
    }
  }

  const fetchCrystalSuggestions = async (filters = {}) => {
    setIsAnimating(true)
    setCurrentPage(1)
    setTimeout(() => setIsAnimating(false), 1500)

    getSuggestedCrystals({
      excludedCrystalIds,
      selectedCrystalIds: formik.values.crystalIds,
      selectedSubscriptionType: formik.values.subscriptionId,
      selectedMonth: formik.values.month,
      selectedYear: formik.values.year,
      ...(cycleRangeMode ? {} : { selectedCycle: formik.values.cycle }),
      ...(cycleRangeMode ? {} : { selectedCycleRangeStart: formik.values.cycleRangeStart }),
      ...(cycleRangeMode ? {} : { selectedCycleRangeEnd: formik.values.cycleRangeEnd }),
      filters,
    })
  }

  const handleRemoveCrystalFromSuggestions = async (e, id: number) => {
    e.stopPropagation()
    setExcludedCrystalIds([...excludedCrystalIds, id])
  }

  return (
    <Box sx={{ marginBottom: crystals.length ? "24px" : 0, padding: "12px", marginLeft: "12px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }} onClick={fetchCrystalSuggestions}>
          <Typography
            sx={{ fontSize: "24px", color: "white", fontStyle: "italic", marginRight: "12px" }}
          >
            Smart Select
          </Typography>
          <LoopIcon
            sx={{
              animation: isAnimating ? "rotate360 1s linear" : "none",
            }}
          />
        </Box>
        <FilterMenu onFilterChange={fetchCrystalSuggestions} />
      </Box>
      {crystals.length > 0 ? (
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
          <ArrowLeftIcon
            sx={{ fontSize: "32px", cursor: "pointer" }}
            onClick={() => updatePage("left")}
          />
          <Typography sx={{ fontSize: "16px", color: "white", marginRight: "4px" }}>
            {currentPage}
          </Typography>
          of
          <Typography sx={{ fontSize: "16px", color: "white", marginLeft: "4px" }}>
            {Math.ceil(crystals.length / pageSize)}
          </Typography>
          <ArrowRightIcon
            sx={{ fontSize: "32px", cursor: "pointer" }}
            onClick={() => updatePage("right")}
          />
        </Box>
      ) : null}
      {pagedCrystals.map((crystal) => {
        return (
          <CrystalChip
            crystal={crystal}
            formik={formik}
            handleRemoveCrystalFromSuggestions={handleRemoveCrystalFromSuggestions}
            selectedCrystalIds={formik.values.crystalIds}
          />
        )
      })}
    </Box>
  )
}

export default SmartSelect
