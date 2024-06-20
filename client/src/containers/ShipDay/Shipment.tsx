import { useState } from "react"

import { Box, Typography } from "@mui/material"

import { useShipmentStore } from "../../store/shipmentStore"

import ColorIndicator from "../../components/ColorIndicator"

import colors from "../../styles/colors"

// import VisibilityIcon from "@mui/icons-material/Visibility"
import UpdateShipmentModal from "../Shipments/UpdateShipmentModal"

const Shipment = ({ shipmentGroup }) => {
  const [selectedShipment, setSelectedShipment] = useState(null)
  // const { updateShipment } = useShipmentStore()

  return (
    <>
      {selectedShipment && (
        <UpdateShipmentModal
          selectedShipment={selectedShipment}
          setSelectedShipment={setSelectedShipment}
        />
      )}
      <Box
        key={shipmentGroup.id}
        sx={{
          padding: "24px",
          margin: "12px",
          background: colors.slateA4,
          minWidth: "20%",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.5em",
            textAlign: "center",
            textDecoration: "underline",
            cursor: "pointer",
            width: "100%",
          }}
          // onClick={() => setSelectedShipment(shipment)}
        >
          {shipmentGroup.subscription.shortName}: {shipmentGroup.shipmentRange}
        </Typography>
        <Box sx={{ marginBottom: "24px", display: "flex", alignItems: "center", width: "100%" }}>
          {/* <Typography
            sx={{
              textAlign: "center",
              // color: shipment?.userCountIsNew ? "red" : "white",
              color: "white",
              marginRight: "4px",
              width: "100%",
            }}
          >
            ({shipment.userCount || 0})
          </Typography> */}
          {/* {shipment?.userCountIsNew && (
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
          )} */}
        </Box>
        <Box>
          {shipmentGroup.crystals
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
    </>
  )
}

export default Shipment
