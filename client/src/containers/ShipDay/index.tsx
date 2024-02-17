import React, { useState } from "react"

import { Container, Box, Typography, TextField } from "@mui/material"

import type { ShipmentT } from "../../types/Shipment"
import { getAllShipments, updateShipment } from "../../api/shipments"

import DateChanger from "./DateChanger"
import ColorIndicator from "../../components/ColorIndicator"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

const ShipDay = () => {
  const [shipments, setShipments] = useState<ShipmentT[]>([])
  const [shipmentToUpdate, setShipmentToUpdate] = useState(null)

  const fetchShipments = async (args) => {
    const response = await getAllShipments(args)
    setShipments(response.data)
  }

  return (
    <Container>
      <DateChanger fetchShipments={fetchShipments} />
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                {shipment.subscription.shortName} #{shipment.cycle}
              </Typography>
              {shipmentToUpdate?.id === shipment.id ? (
                <TextField
                  type="number"
                  sx={{ ...textFieldStyles, marginBottom: "24px", width: "100px" }}
                  onBlur={(e) => {
                    updateShipment({
                      ...shipmentToUpdate,
                      userCount: e.target.value || shipmentToUpdate.userCount,
                    })
                    setShipmentToUpdate(null)
                    setTimeout(() => {
                      fetchShipments({})
                    }, 100)
                  }}
                />
              ) : (
                <Typography
                  sx={{ textAlign: "center", marginBottom: "24px" }}
                  onClick={() => setShipmentToUpdate(shipment)}
                >
                  ({shipment.userCount || 0})
                </Typography>
              )}
              <Box>
                {shipment.crystals
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((crystal) => (
                    <Box
                      key={crystal.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ColorIndicator indicatorValue={crystal.color?.hex} />
                      <Box sx={{ marginLeft: "4px" }}>{crystal.name}</Box>
                    </Box>
                  ))}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Container>
  )
}

export default ShipDay
