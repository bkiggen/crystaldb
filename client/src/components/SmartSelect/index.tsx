import React, { useState } from "react"

import { useFormik } from "formik"

import { Box, Typography } from "@mui/material"
import LoopIcon from "@mui/icons-material/Loop"

import { getSuggestedCrystals } from "../../api/crystals"

import type { CrystalT } from "../../types/Crystal"

import CrystalChip from "./CrystalChip"

type CrystalSelectT = {
  formik: ReturnType<typeof useFormik>
}

const CrystalSelect = ({ formik }: CrystalSelectT) => {
  const [suggestedCrystals, setSuggestedCrystals] = useState<CrystalT[]>([])
  const [excludedCrystalIds, setExcludedCrystalIds] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const selectedCrystalIds = formik.values.crystalIds
  const selectedSubscriptionType = formik.values.subscriptionId
  const selectedMonth = formik.values.month
  const selectedYear = formik.values.year
  const selectedCycle = formik.values.cycle

  const crystals = suggestedCrystals.filter((crystal) => {
    return !excludedCrystalIds.includes(crystal.id)
  })

  const fetchCrystalSuggestions = async () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1500)

    const response = await getSuggestedCrystals({
      excludedCrystalIds,
      selectedCrystalIds,
      selectedSubscriptionType,
      selectedMonth,
      selectedYear,
      selectedCycle,
    })
    setSuggestedCrystals(response.data || [])
  }

  const handleRemoveCrystalFromSuggestions = async (e, id: number) => {
    e.stopPropagation()
    setExcludedCrystalIds([...excludedCrystalIds, id])
  }

  return (
    <Box sx={{ marginBottom: crystals.length ? "24px" : 0, padding: "12px", marginLeft: "12px" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", marginBottom: "36px", cursor: "pointer" }}
        onClick={fetchCrystalSuggestions}
      >
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
      {crystals.map((crystal) => {
        return (
          <CrystalChip
            crystal={crystal}
            formik={formik}
            handleRemoveCrystalFromSuggestions={handleRemoveCrystalFromSuggestions}
            selectedCrystalIds={selectedCrystalIds}
          />
        )
      })}
    </Box>
  )
}

export default CrystalSelect
