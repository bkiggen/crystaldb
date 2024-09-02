import { Box } from "@mui/material"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import RemoveIcon from "@mui/icons-material/Remove"
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt"

type InventoryIndicatorT = {
  indicatorType?: string
  indicatorValue: string
}

const InventoryIndicator = ({ indicatorValue }: InventoryIndicatorT) => {
  const values = {
    HIGH: <ArrowUpwardIcon sx={{ fontSize: "18px" }} />,
    MEDIUM: <RemoveIcon sx={{ fontSize: "18px" }} />,
    LOW: <ArrowDownwardIcon sx={{ fontSize: "18px" }} />,
    OUT: <DoDisturbAltIcon sx={{ fontSize: "18px" }} />,
  }

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginRight: "12px" }}
    >
      {values[indicatorValue]}
    </Box>
  )
}

export default InventoryIndicator
