import React, { useState } from "react"

import { Container, Box, Typography } from "@mui/material"

import type { ShipmentT } from "../../types/Shipment"

import DateChanger from "./DateChanger"
import colors from "../../styles/colors"

const NewShipment = () => {
  const [shipments, setShipments] = useState<ShipmentT[]>([])

  return (
    <Container>
      <DateChanger setShipments={setShipments} />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {shipments.map((shipment) => {
          return (
            <Box
              sx={{ padding: "12px", margin: "12px", background: colors.darkBlue, minWidth: "20%" }}
            >
              <Typography>{shipment.cycle}</Typography>
              {shipment.crystals.map((crystal) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ marginRight: "6px" }}>{crystal.name}</Box>
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Box>
    </Container>
  )
}

export default NewShipment
