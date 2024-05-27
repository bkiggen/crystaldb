import { Box } from "@mui/material"

import { useShipmentStore } from "../../store/shipmentStore"
import { useStore } from "../../store/utilityStore"

import DateChanger from "./DateChanger"

import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import Shipment from "./Shipment"

const ShipDay = () => {
  const { shipments, fetchShipments } = useShipmentStore()

  const isFullScreen = useStore((state) => {
    return state.isFullScreen
  })
  const toggleFullscreen = useStore((state) => {
    return state.toggleFullscreen
  })

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
      <Box
        sx={{
          margin: "12px 2%",
        }}
      >
        <DateChanger fetchShipments={fetchShipments} />
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {shipments.map((shipment) => {
            return <Shipment key={shipment.id} shipment={shipment} />
          })}
        </Box>
      </Box>
    </>
  )
}

export default ShipDay
