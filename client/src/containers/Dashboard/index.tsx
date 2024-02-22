import React from "react"

import { Container } from "@mui/material"

import InventoryReport from "./InventoryReport"

const Dashboard = () => {
  return (
    <Container sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <InventoryReport type="LOW" />
      <InventoryReport type="OUT" />
    </Container>
  )
}

export default Dashboard
