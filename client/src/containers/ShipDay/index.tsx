import { Box } from "@mui/material"
import { useShipmentStore } from "../../store/shipmentStore"
import { useStore } from "../../store/utilityStore"
import DateChanger from "./DateChanger"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import Shipment from "./Shipment"

const ShipDay = () => {
  const { shipments, fetchShipments } = useShipmentStore()

  const shipmentGroups = groupShipments(shipments)

  const isFullScreen = useStore((state) => state.isFullScreen)
  const toggleFullscreen = useStore((state) => state.toggleFullscreen)

  return (
    <>
      {isFullScreen ? (
        <FullscreenExitIcon
          sx={{ position: "absolute", bottom: "20px", left: "20px", cursor: "pointer" }}
          onClick={toggleFullscreen}
        />
      ) : (
        <FullscreenIcon
          sx={{ position: "absolute", bottom: "20px", left: "20px", cursor: "pointer" }}
          onClick={toggleFullscreen}
        />
      )}
      <Box sx={{ margin: "12px 2%" }}>
        <DateChanger fetchShipments={fetchShipments} />
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {shipmentGroups.map((shipmentGroup) => {
            return <Shipment key={shipmentGroup.groupLabel} shipmentGroup={shipmentGroup} />
          })}
        </Box>
      </Box>
    </>
  )
}

export default ShipDay

function groupShipments(shipments) {
  if (!Array.isArray(shipments) || shipments.length === 0) {
    return [] // Return an empty array if shipments is not a valid array
  }

  const shipmentGroups = {}

  shipments.forEach((shipment) => {
    const groupLabel = shipment.groupLabel

    if (!shipmentGroups[groupLabel]) {
      shipmentGroups[groupLabel] = {
        groupLabel: groupLabel,
        crystals: [],
        shipments: [],
        crystalIds: new Set(), // Use a Set to track unique crystal IDs
      }
    }

    // Add all unique crystals from this shipment to the group
    shipment.crystals.forEach((crystal) => {
      if (!shipmentGroups[groupLabel].crystalIds.has(crystal.id)) {
        shipmentGroups[groupLabel].crystals.push(crystal)
        shipmentGroups[groupLabel].crystalIds.add(crystal.id)
      }
    })

    shipmentGroups[groupLabel].shipments.push(shipment)
  })

  // Convert the groups into an array
  return Object.keys(shipmentGroups).map((groupLabel) => {
    const group = shipmentGroups[groupLabel]
    return {
      groupLabel: group.groupLabel,
      crystals: group.crystals,
      shipments: group.shipments,
      userCount: 0,
    }
  })
}
