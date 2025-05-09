import { useState } from "react"
import { useFormik } from "formik"
import { Box, Typography } from "@mui/material"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import { useCrystalStore } from "../../store/crystalStore"
import CrystalChip from "./CrystalChip"
import FilterMenu from "./FilterMenu"
import { excludeFilters } from "./excludeFilters"
import { isEmpty } from "lodash"

type SmartSelectT = {
  formik: ReturnType<typeof useFormik>
  month?: string
  year?: string
}

const SmartSelect = ({ formik, month, year }: SmartSelectT) => {
  const { suggestedCrystals, fetchSuggestedCrystals } = useCrystalStore()
  const [currentPage, setCurrentPage] = useState(1)

  const [activeFilters, setActiveFilters] = useState({})

  const PAGE_SIZE = 20

  const [excludedCrystalIds, setExcludedCrystalIds] = useState<number[]>([])

  const crystals = suggestedCrystals.filter((crystal) => {
    return !excludedCrystalIds.includes(crystal.id)
  })

  const pagedCrystals = crystals.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updatePage = (direction: "left" | "right") => {
    const totalPages = Math.ceil(crystals.length / PAGE_SIZE)

    if (direction === "left") {
      setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : totalPages))
    } else {
      setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : 1))
    }
  }

  const fetchCrystalSuggestions = async () => {
    if (!isEmpty(activeFilters)) {
      setCurrentPage(1)
      const filters = excludeFilters(activeFilters)

      fetchSuggestedCrystals({
        excludedCrystalIds,
        selectedCrystalIds: formik.values.crystalIds,
        selectedSubscriptionType: formik.values.subscriptionId,
        selectedMonth: formik.values.month || month,
        selectedYear: formik.values.year || year,
        selectedCyclesString: formik.values.cycle,
        filters,
      })
    }
  }

  const handleRemoveCrystalFromSuggestions = async (e, id: number) => {
    e.stopPropagation()
    setExcludedCrystalIds([...excludedCrystalIds, id])
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: "24px", color: "white", fontStyle: "italic", marginRight: "12px" }}
            onClick={fetchCrystalSuggestions}
          >
            Smart Select
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", marginLeft: "12px" }}>
            <ArrowLeftIcon
              sx={{ fontSize: "32px", cursor: "pointer", color: "white" }}
              onClick={() => updatePage("left")}
            />
            <Typography sx={{ fontSize: "16px", color: "white", marginRight: "4px" }}>
              {currentPage}
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "white" }}>of</Typography>
            <Typography sx={{ fontSize: "16px", color: "white", marginLeft: "4px" }}>
              {Math.ceil(crystals.length / PAGE_SIZE || 1)}
            </Typography>
            <ArrowRightIcon
              sx={{ fontSize: "32px", cursor: "pointer", color: "white" }}
              onClick={() => updatePage("right")}
            />
          </Box>
        </Box>
        <FilterMenu
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          defaultFilteredOut={{ inventory: ["OUT"] }}
          fetchCrystals={fetchCrystalSuggestions}
        />
      </Box>
      {pagedCrystals.length ? (
        <Box>
          {pagedCrystals.map((crystal) => {
            return (
              <CrystalChip
                crystal={crystal}
                formik={formik}
                handleRemoveCrystal={handleRemoveCrystalFromSuggestions}
                selectedCrystalIds={formik.values.crystalIds}
              />
            )
          })}
        </Box>
      ) : null}
    </Box>
  )
}

export default SmartSelect
