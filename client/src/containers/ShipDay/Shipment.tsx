import { useState } from "react"
import { Box, Typography } from "@mui/material"
import ColorIndicator from "../../components/ColorIndicator"
import colors from "../../styles/colors"
import UpdateShipmentModal from "../Shipments/UpdateShipmentModal"

const Shipment = ({
  shipmentGroup,
  // loadingShipstation
}) => {
  const [selectedShipment, setSelectedShipment] = useState(null)

  const groupLabel = shipmentGroup.groupLabel || ""
  const subType = shipmentGroup.subscription.shortName
  const shipmentNumber = groupLabel.match(/-\s([\d-]+)\s\(/)?.[1]

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
          padding: "12px",
          background: colors.slateA4,
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "300px",
          maxHeight: "300px",
          overflowY: "auto",
          overflowX: "hidden",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <a
          href={`/shipments?searchTerm=${shipmentGroup.groupLabel}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textAlign: "center",
            textDecoration: "underline",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.5em",
              color: "white",
            }}
          >
            {shipmentNumber || "No Group"}
          </Typography>
        </a>
        {/* <Box
          sx={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {!loadingShipstation && (
            <Typography
              sx={{
                textAlign: "center",
                color: "white",
                marginRight: "4px",
                width: "100%",
                fontSize: "1em",
              }}
            >
              Count: {shipmentGroup.count}
            </Typography>
          )}
        </Box> */}
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
                <Box sx={{ marginLeft: "4px", color: "white" }}>{crystal.name}</Box>
              </Box>
            ))}
        </Box>
        <Box sx={{ bottom: "8px", right: "16px", position: "absolute", color: colors.slateGrey }}>
          {subType}
        </Box>
      </Box>
    </>
  )
}

export default Shipment
