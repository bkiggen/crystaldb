import { useState } from "react"

import { Box } from "@mui/material"

import type { ShipmentT } from "../../types/Shipment"
import { getAllShipments } from "../../api/shipments"
import { useStore } from "../../store/store"

import DateChanger from "./DateChanger"

import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import Shipment from "./Shipment"

const ShipDay = () => {
  const [shipments, setShipments] = useState<ShipmentT[]>([])

  const isFullScreen = useStore((state) => {
    return state.isFullScreen
  })
  const toggleFullscreen = useStore((state) => {
    return state.toggleFullscreen
  })

  const fetchShipments = async (args) => {
    const response = await getAllShipments(args)
    setShipments(response.data)
  }

  const updateLocalState = (newData) => {
    setTimeout(() => {
      const newShipments = shipments.map((s) => {
        if (s.id === newData.id) {
          return newData
        }
        return s
      })
      setShipments(newShipments)
    }, 100)
  }

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
            return <Shipment shipment={shipment} updateLocalState={updateLocalState} />
          })}
        </Box>
      </Box>
    </>
  )
}

export default ShipDay
