import { Box } from "@mui/material"

type ColorIndicatorT = {
  indicatorType?: string
  indicatorValue: string
}

const ColorIndicator = ({ indicatorType, indicatorValue }: ColorIndicatorT) => {
  const colors = {
    rarity: { LOW: "green", MEDIUM: "yellow", HIGH: "red" },
    findAge: { NEW: "green", OLD: "yellow", DEAD: "red" },
    inventory: { HIGH: "green", MEDIUM: "yellow", LOW: "red", OUT: "black" },
  }

  const bg = indicatorType ? colors[indicatorType][indicatorValue] : indicatorValue

  return (
    <Box
      sx={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: bg || "transparent",
        boxShadow: "0 0 0 1px #1c1c1c",
        marginRight: "6px",
      }}
    />
  )
}

export default ColorIndicator
