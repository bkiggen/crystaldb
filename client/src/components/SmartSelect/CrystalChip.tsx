import React from "react"

import { useFormik } from "formik"

import { Box, Chip, Tooltip, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

import type { CrystalT } from "../../types/Crystal"

import ColorIndicator from "../ColorIndicator"
import InventoryIndicator from "../InventoryIndicator"

type CrystalChipT = {
  crystal: CrystalT
  formik?: ReturnType<typeof useFormik>
  handleRemoveCrystalFromSuggestions?: (e: React.MouseEvent, id: number) => void
  selectedCrystalIds?: number[]
  withoutDelete?: boolean
  fontSize?: string
}

const CrystalChip = ({
  crystal,
  formik,
  handleRemoveCrystalFromSuggestions = () => null,
  selectedCrystalIds,
  withoutDelete,
  fontSize = "14px",
}: CrystalChipT) => {
  return (
    <Tooltip
      placement="top"
      title={
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
            <Typography sx={{ fontSize, marginRight: "4px" }}>Inventory:</Typography>
            <Typography sx={{ fontSize, marginRight: "4px", fontWeight: 600 }}>
              {crystal.inventory}
            </Typography>
            <InventoryIndicator indicatorValue={crystal.inventory} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
            <Typography sx={{ fontSize, marginRight: "4px" }}>Category:</Typography>
            <Typography sx={{ fontSize, marginRight: "4px", fontWeight: 600 }}>
              {crystal.category?.name || "None"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontSize, marginRight: "4px" }}>Location:</Typography>
            <Typography sx={{ fontSize, marginRight: "4px", fontWeight: 600 }}>
              {crystal.location?.name || "None"}
            </Typography>
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
              <Typography sx={{ fontSize, textTransform: "capitalize" }}>
                {crystal?.name}
              </Typography>
            </Box>
            {withoutDelete ? null : (
              <CloseIcon
                sx={{ color: "white", fontSize: "16px", marginLeft: "16px" }}
                onClick={(e) => {
                  handleRemoveCrystalFromSuggestions(e, crystal.id)
                }}
              />
            )}
          </Box>
        }
        onClick={() => {
          if (selectedCrystalIds?.includes(crystal.id)) {
            formik.setFieldValue(
              "crystalIds",
              selectedCrystalIds.filter((id) => id !== crystal.id),
            )
          } else {
            if (selectedCrystalIds.length) {
              const allIds = [...selectedCrystalIds, crystal.id]
              const uniqueIds = Array.from(new Set(allIds))
              formik.setFieldValue("crystalIds", uniqueIds)
            }
          }
        }}
        sx={{
          color: "white",
          cursor: "pointer",
          margin: "6px",
          background: selectedCrystalIds?.includes(crystal.id)
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.2)",
        }}
      />
    </Tooltip>
  )
}

export default CrystalChip
