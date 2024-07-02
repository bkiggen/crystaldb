import { Container } from "@mui/material"

import InventoryReport from "./InventoryReport"
import UnusedCrystalReport from "./UnusedCrystalReport"

const Dashboard = () => {
  return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <InventoryReport type="LOW" />
      <InventoryReport type="OUT" />
      <UnusedCrystalReport />
    </Container>
  )
}

export default Dashboard
