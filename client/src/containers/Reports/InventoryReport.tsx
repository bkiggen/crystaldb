import { useEffect, useState } from "react"

import { Box, Button, Typography } from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"

import { useCrystalStore } from "../../store/crystalStore"

import createCSVFromArray from "../../util/createCSVFromArray"

import ColorIndicator from "../../components/ColorIndicator"

import colors from "../../styles/colors"
import UpdateCrystalModal from "../Crystals/UpdateCrystalModal"

type InventoryReportT = {
  type: "LOW" | "MEDIUM" | "HIGH" | "OUT"
}

const InventoryReport = ({ type }: InventoryReportT) => {
  const { crystals, fetchCrystals } = useCrystalStore()
  const [crystalToUpdate, setCrystalToUpdate] = useState(null)

  useEffect(() => {
    fetchCrystals({
      noPaging: true,
      inventory: type,
    })
  }, [])

  const getBackground = (inventory: string) => {
    const colors = {
      OUT: "black",
      LOW: "red",
      MEDIUM: "yellow",
      HIGH: "green",
    }
    return colors[inventory] || "white"
  }

  const handleCSVClick = () => {
    const preparedList = crystals.map((c) => {
      return {
        ...c,
        color: c.color?.name,
      }
    })
    createCSVFromArray(preparedList, `${type.toLowerCase()}-inventory-report.csv`)
  }

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
      <Button
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
        }}
        variant="outlined"
        onClick={handleCSVClick}
      >
        <DownloadIcon />
      </Button>
      <Typography
        sx={{ fontSize: "32px", textAlign: "center", marginBottom: "24px", color: "white" }}
      >
        Inventory:{" "}
        <Typography sx={{ fontSize: "32px", display: "inline", color: getBackground(type) }}>
          {type}
        </Typography>
      </Typography>
      <Box
        sx={{
          overflowY: "auto",
          height: "calc(100% - 124px)",
          padding: "0px 12px",
          margin: "12px",
        }}
      >
        {crystals.map((c) => {
          return (
            <Box
              key={c.id}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
                borderRadius: "4px",
                border: "1px solid white",
                padding: "4px 12px",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: colors.slateA4,
                },
              }}
              onClick={() => setCrystalToUpdate(c)}
            >
              <ColorIndicator indicatorValue={c.color?.hex} />
              <Box sx={{ color: "white" }}>{c.name}</Box>
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
