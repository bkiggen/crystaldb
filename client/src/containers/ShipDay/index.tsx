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
  console.log("🚀 ~ ShipDay ~ shipmentGroups:", shipmentGroups)

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
            return <Shipment key={shipmentGroup.id} shipmentGroup={shipmentGroup} />
          })}
        </Box>
      </Box>
    </>
  )
}

export default ShipDay

function parseCycles(cycles) {
  cycles.sort((a, b) => a - b)
  let rangeStr = ""
  let start = cycles[0]

  for (let i = 1; i <= cycles.length; i++) {
    if (i === cycles.length || cycles[i] !== cycles[i - 1] + 1) {
      if (start === cycles[i - 1]) {
        rangeStr += `${start}, `
      } else {
        rangeStr += `${start}-${cycles[i - 1]}, `
      }
      start = cycles[i]
    }
  }

  return rangeStr.slice(0, -2) // Remove the trailing comma and space
}

function groupShipments(shipments) {
  const shipmentGroups = {}

  shipments.forEach((shipment) => {
    // Create a unique identifier for the crystal group and subscription ID
    const crystalIds = shipment.crystals
      .map((crystal) => crystal.id)
      .sort()
      .join(",")
    const subscriptionId = shipment.subscription.id
    const uniqueId = `${crystalIds}-${subscriptionId}`

    if (!shipmentGroups[uniqueId]) {
      shipmentGroups[uniqueId] = {
        shipments: [],
        cycles: [],
      }
    }

    shipmentGroups[uniqueId].shipments.push(shipment)
    shipmentGroups[uniqueId].cycles.push(shipment.cycle)
  })

  // Convert the groups into an array with shipmentRange property
  return Object.keys(shipmentGroups).map((uniqueId) => {
    const group = shipmentGroups[uniqueId]
    return {
      shipments: group.shipments,
      crystals: group.shipments[0].crystals,
      subscription: group.shipments[0].subscription,
      id: uniqueId,
      shipmentRange: parseCycles(group.cycles),
    }
  })
}
