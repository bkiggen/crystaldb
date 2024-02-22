import React, { useState, useEffect } from "react"

import { Box, Button, Typography } from "@mui/material"
import DownloadIcon from "@mui/icons-material/Download"

import { getAllCrystals } from "../../api/crystals"

import type { CrystalT } from "../../types/Crystal"

import createCSVFromArray from "../../util/createCSVFromArray"

import ColorIndicator from "../../components/ColorIndicator"

import colors from "../../styles/colors"

type InventoryReportT = {
  type: "LOW" | "MEDIUM" | "HIGH" | "OUT"
}

const InventoryReport = ({ type }: InventoryReportT) => {
  const [allCrystals, setAllCrystals] = useState<CrystalT[]>([])

  useEffect(() => {
    const fetchCrystals = async () => {
      const response = await getAllCrystals({
        noPaging: true,
        inventory: type,
      })
      setAllCrystals(response.data || [])
    }
    fetchCrystals()
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
    const preparedList = allCrystals.map((c) => {
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
        width: "45%",
        backgroundColor: colors.slateA4,
        border: `1px solid white`,
        borderRadius: "4px",
        padding: "12px",
        paddingTop: "24px",
        margin: "12px",
        minWidth: "400px",
        position: "relative",
      }}
    >
      <button
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
        }}
        variant="outlined"
        onClick={handleCSVClick}
      >
        <DownloadIcon />
      </button>
      <Typography
        sx={{ fontSize: "32px", textAlign: "center", marginBottom: "12px", color: "white" }}
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
          padding: "24px",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            border: "none",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#A0A0A0",
          },
          "&:hover": {
            "&::-webkit-scrollbar-thumb": {
              background: "#C0C0C0",
            },
          },
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "transparent transparent",
        }}
      >
        {allCrystals.map((c) => {
          return (
            <Box
              key={c.id}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
                borderRadius: "4px",
              }}
            >
              <ColorIndicator indicatorValue={c.color?.hex} />
              <Box>{c.name}</Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default InventoryReport
