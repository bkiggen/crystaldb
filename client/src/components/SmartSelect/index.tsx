import React, { useState } from "react"

import { useFormik } from "formik"

import { Box, Typography } from "@mui/material"
import LoopIcon from "@mui/icons-material/Loop"

import { getSuggestedCrystals } from "../../api/crystals"

import type { CrystalT } from "../../types/Crystal"

import CrystalChip from "./CrystalChip"

type SmartSelectT = {
  formik: ReturnType<typeof useFormik>
  cycleRangeMode: boolean
}

const SmartSelect = ({ formik, cycleRangeMode }: SmartSelectT) => {
  const [suggestedCrystals, setSuggestedCrystals] = useState<CrystalT[]>([])
  const [excludedCrystalIds, setExcludedCrystalIds] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const crystals = suggestedCrystals.filter((crystal) => {
    return !excludedCrystalIds.includes(crystal.id)
  })

  const fetchCrystalSuggestions = async () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1500)

    const response = await getSuggestedCrystals({
      excludedCrystalIds,
      selectedCrystalIds: formik.values.crystalIds,
      selectedSubscriptionType: formik.values.subscriptionId,
      selectedMonth: formik.values.month,
      selectedYear: formik.values.year,
      ...(cycleRangeMode ? {} : { selectedCycle: formik.values.cycle }),
      ...(cycleRangeMode ? {} : { selectedCycleRangeStart: formik.values.cycleRangeStart }),
      ...(cycleRangeMode ? {} : { selectedCycleRangeEnd: formik.values.cycleRangeEnd }),
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
            selectedCrystalIds={formik.values.crystalIds}
          />
        )
      })}
    </Box>
  )
}

export default SmartSelect
