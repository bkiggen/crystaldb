import React from "react"

import { Box } from "@mui/material"

type ColorIndicatorT = {
  indicatorType: string
  indicatorValue: string
}

const ColorIndicator = ({ indicatorType, indicatorValue }: ColorIndicatorT) => {
  const colors = {
    rarity: { LOW: "green", MEDIUM: "yellow", HIGH: "red" },
    findAge: { NEW: "green", OLD: "yellow", DEAD: "red" },
  }

  return (
    <Box
      sx={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: colors[indicatorType][indicatorValue],
        marginRight: "8px",
      }}
    />
  )
}

export default ColorIndicator
