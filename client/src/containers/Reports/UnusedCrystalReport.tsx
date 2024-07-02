import { useEffect, useState } from "react"

import { Box, Typography } from "@mui/material"

import { useCrystalStore } from "../../store/crystalStore"
import type { CrystalT } from "../../types/Crystal"

import ColorIndicator from "../../components/ColorIndicator"
import UpdateCrystalModal from "../Crystals/UpdateCrystalModal"

import colors from "../../styles/colors"

const InventoryReport = () => {
  const { unusedCrystals, fetchUnusedCrystals } = useCrystalStore()
  const [crystalToUpdate, setCrystalToUpdate] = useState<CrystalT>(null)

  useEffect(() => {
    fetchUnusedCrystals()
  }, [])

  return (
    <Box
      sx={{
        height: "500px",
        width: "40%",
        minWidth: "400px",
        backgroundColor: colors.slateA4,
        border: `1px solid white`,
        borderRadius: "4px",
        padding: "32px 12px",
        margin: "12px",
        position: "relative",
        flexGrow: 1,
      }}
    >
      <Typography
        sx={{ fontSize: "32px", textAlign: "center", marginBottom: "24px", color: "white" }}
      >
        Unused Crystals:
      </Typography>
      <Box
        sx={{
          overflowY: "auto",
          height: "calc(100% - 124px)",
          padding: "0px 12px",
          margin: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {unusedCrystals.map((c) => {
          return (
            <Box
              key={c.id}
              sx={{
                flexGrow: 1,
                width: "40%",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                border: "1px solid white",
                padding: "4px 12px",
                cursor: "pointer",
              }}
              onClick={() => setCrystalToUpdate(c)}
            >
              <ColorIndicator indicatorValue={c.color?.hex} />
              <Box>{c.name}</Box>
            </Box>
          )
        })}
        {crystalToUpdate ? (
          <UpdateCrystalModal
            listCrystal={crystalToUpdate}
            onClose={() => setCrystalToUpdate(null)}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default InventoryReport
