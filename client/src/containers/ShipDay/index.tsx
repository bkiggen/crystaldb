import React, { useState } from "react"

import { Container, Box, Typography } from "@mui/material"

import type { ShipmentT } from "../../types/Shipment"

import DateChanger from "./DateChanger"
import ColorIndicator from "../../components/ColorIndicator"

import colors from "../../styles/colors"

const ShipDay = () => {
  const [shipments, setShipments] = useState<ShipmentT[]>([])

  return (
    <Container>
      <DateChanger setShipments={setShipments} />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {shipments.map((shipment) => {
          return (
            <Box
              sx={{
                padding: "12px",
                margin: "12px",
                background: colors.darkBlue,
                minWidth: "20%",
                borderRadius: "4px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.5em",
                  textAlign: "center",
                  textDecoration: "underline",
                }}
              >
                Cycle {shipment.cycle}
              </Typography>
              <Typography sx={{ textAlign: "center", marginBottom: "24px" }}>
                ({shipment.cycle})
              </Typography>
              {shipment.crystals.map((crystal) => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ColorIndicator indicatorValue={crystal.color?.hex} />
                    <Box sx={{ marginLeft: "4px" }}>{crystal.name}</Box>
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

export default ShipDay
