import { Container } from "@mui/material"

import InventoryReport from "./InventoryReport"

const Dashboard = () => {
  return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <InventoryReport type="LOW" />
      <InventoryReport type="OUT" />
    </Container>
  )
}

export default Dashboard
