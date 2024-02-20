import React from "react"

import { useFormik } from "formik"

import { Box, Chip, Tooltip, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

import type { CrystalT } from "../../types/Crystal"

import ColorIndicator from "../ColorIndicator"

type CrystalChipT = {
  crystal: CrystalT
  formik: ReturnType<typeof useFormik>
  handleRemoveCrystalFromSuggestions?: (e: React.MouseEvent, id: number) => void
  selectedCrystalIds: number[]
}

const CrystalChip = ({
  crystal,
  formik,
  handleRemoveCrystalFromSuggestions = () => null,
  selectedCrystalIds,
}: CrystalChipT) => {
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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            const allIds = [...selectedCrystalIds, crystal.id]
            const uniqueIds = Array.from(new Set(allIds))
            formik.setFieldValue("crystalIds", uniqueIds)
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
}

export default CrystalChip
