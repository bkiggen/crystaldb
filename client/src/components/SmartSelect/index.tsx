import { useState } from "react"

import { useFormik } from "formik"

import { Box, Typography } from "@mui/material"
import LoopIcon from "@mui/icons-material/Loop"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

import { useCrystalStore } from "../../store/crystalStore"

import CrystalChip from "./CrystalChip"
import FilterMenu from "./FilterMenu"

type SmartSelectT = {
  formik: ReturnType<typeof useFormik>
}

const SmartSelect = ({ formik }: SmartSelectT) => {
  const { suggestedCrystals, fetchSuggestedCrystals } = useCrystalStore()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [excludedCrystalIds, setExcludedCrystalIds] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const crystals = suggestedCrystals.filter((crystal) => {
    return !excludedCrystalIds.includes(crystal.id)
  })

  const pagedCrystals = crystals.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updatePage = (direction: "left" | "right") => {
    const totalPages = Math.ceil(crystals.length / pageSize)

    if (direction === "left") {
      setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : totalPages))
    } else {
      setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : 1))
    }
  }

  const fetchCrystalSuggestions = async (filters = {}) => {
    setIsAnimating(true)
    setCurrentPage(1)
    setTimeout(() => setIsAnimating(false), 1500)

    fetchSuggestedCrystals({
      excludedCrystalIds,
      selectedCrystalIds: formik.values.crystalIds,
      selectedSubscriptionType: formik.values.subscriptionId,
      selectedMonth: formik.values.month,
      selectedYear: formik.values.year,
      selectedCycle: formik.values.cycle,
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
