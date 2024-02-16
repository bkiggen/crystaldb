import React, { useState } from "react"

import { useFormik } from "formik"

import { Box, Chip, Tooltip, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import LoopIcon from "@mui/icons-material/Loop"

import { getSuggestedCrystals } from "../../api/crystals"

import type { CrystalT } from "../../types/Crystal"

import ColorIndicator from "../ColorIndicator"

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
    <Box sx={{ marginBottom: crystals.length ? "24px" : 0, padding: "12px" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", marginBottom: "18px", cursor: "pointer" }}
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
          <Tooltip
            placement="top"
            title={
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "12px", marginRight: "4px" }}>Inventory:</Typography>
                  <Typography sx={{ fontSize: "12px", marginRight: "4px" }}>
                    {crystal.inventory}
                  </Typography>
                  <ColorIndicator indicatorType="inventory" indicatorValue={crystal.inventory} />
                </Box>
              </Box>
            }
          >
            <Chip
              variant="outlined"
              label={
                <Box
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ColorIndicator indicatorValue={crystal?.color?.hex} />
                    <Typography sx={{ fontSize: "14px" }}>{crystal?.name}</Typography>
                  </Box>
                  <CloseIcon
                    sx={{ color: "white", fontSize: "16px", marginLeft: "16px" }}
                    onClick={(e) => {
                      handleRemoveCrystalFromSuggestions(e, crystal.id)
                    }}
                  />
                </Box>
              }
              onClick={() => {
                if (selectedCrystalIds.includes(crystal.id)) {
                  formik.setFieldValue(
                    "crystalIds",
                    selectedCrystalIds.filter((id) => id !== crystal.id),
                  )
                } else {
                  formik.setFieldValue("crystalIds", [...selectedCrystalIds, crystal.id])
                }
              }}
              sx={{
                color: "white",
                cursor: "pointer",
                margin: "6px",
                background: selectedCrystalIds.includes(crystal.id)
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)",
              }}
            />
          </Tooltip>
        )
      })}
    </Box>
  )
}

export default CrystalSelect
