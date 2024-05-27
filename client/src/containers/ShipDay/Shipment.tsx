import { useState } from "react"

import { Box, Typography, TextField } from "@mui/material"

import { useShipmentStore } from "../../store/shipmentStore"

import ColorIndicator from "../../components/ColorIndicator"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import VisibilityIcon from "@mui/icons-material/Visibility"

const Shipment = ({ shipment }) => {
  const [shipmentToUpdate, setShipmentToUpdate] = useState(null)
  const { updateShipment } = useShipmentStore()

  return (
    <Box
      key={shipment.id}
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
            const newData = {
              ...shipmentToUpdate,
              userCount: e.target.value || shipmentToUpdate.userCount,
              userCountIsNew: true,
            }
            updateShipment(newData)
            setShipmentToUpdate(null)
          }}
        />
      ) : (
        <Box sx={{ marginBottom: "24px", display: "flex", alignItems: "center" }}>
          <Typography
            sx={{
              textAlign: "center",
              color: shipment?.userCountIsNew ? "red" : "white",
              marginRight: "4px",
            }}
            onClick={() => setShipmentToUpdate(shipment)}
          >
            ({shipment.userCount || 0})
          </Typography>
          {shipment?.userCountIsNew && (
            <VisibilityIcon
              sx={{ color: "red", cursor: "pointer" }}
              onClick={() => {
                const newData = {
                  ...shipment,
                  userCountIsNew: false,
                }
                updateShipment(newData)
              }}
            />
          )}
        </Box>
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
}

export default Shipment
