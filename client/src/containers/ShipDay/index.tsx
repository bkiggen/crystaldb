import { Box, CircularProgress } from "@mui/material"
import { useShipmentStore } from "../../store/shipmentStore"
import { useStore } from "../../store/utilityStore"
import DateChanger from "./DateChanger"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"
import Shipment from "./Shipment"
import { useEffect, useState } from "react"
import { callShipStationApi } from "../../api/shipstation"
// import PrintContent from "./PrintContent"

const ShipDay = () => {
  const { shipments, fetchShipments } = useShipmentStore()
  const [shipmentGroups, setShipmentGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [shipmentCounts, setShipmentCounts] = useState({})

  const isFullScreen = useStore((state) => state.isFullScreen)
  const toggleFullscreen = useStore((state) => state.toggleFullscreen)

  const fetchShipstationShipments = async ({ page = 1 }) => {
    setLoading(true)

    try {
      const response: any = await callShipStationApi({
        method: "GET",
        path: `/orders?page=${page}&pageSize=500&orderStatus=awaiting_shipment`,
      })

      // Extract numbers
      const out = response.orders.map((order) => {
        if (order.advancedOptions.customField1) {
          const strippedShipmentCycle = order.advancedOptions.customField1.match(/#(\d+)/)
          return strippedShipmentCycle ? parseInt(strippedShipmentCycle[1], 10) : null
        } else {
          // TODO: figure this out, why happening?
          console.log("🚀 ~ out ~ order.advancedOptions.customField1:", order.advancedOptions)
          return "whatever"
        }
      })

      // Filter out null values
      const validNumbers = out.filter((num) => num !== null)

      // Count occurrences
      const counts = validNumbers.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1
        return acc
      }, {})

      setShipmentCounts(counts)
    } catch (error) {
      console.error("Error fetching shipments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShipstationShipments({})
  }, [])

  useEffect(() => {
    if (!loading) {
      const groups = groupShipments(shipments, shipmentCounts)
      setShipmentGroups(groups)
    }
  }, [shipments, loading])

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
        {/* <PrintContent data={shipmentGroups} /> */}
        {loading ? (
          <Box sx={{ widht: "100%", display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {shipmentGroups.map((shipmentGroup) => {
              return (
                <Shipment
                  key={shipmentGroup.groupLabel}
                  shipmentGroup={shipmentGroup}
                  loadingShipstation={loading}
                />
              )
            })}
          </Box>
        )}
      </Box>
    </>
  )
}

export default ShipDay

const parseGroupLabel = (groupLabel) => {
  if (typeof groupLabel !== "string" || !groupLabel) {
    return []
  }
  // Initialize an array to hold the parsed numbers
  let numbers = []

  if (groupLabel.includes(",")) {
    // Case: Comma-separated values (e.g., "12, 23, 42")
    numbers = groupLabel
      .split(",") // Split by comma
      .map((num) => parseInt(num.trim(), 10)) // Trim and parse each number
  } else if (groupLabel.includes("-")) {
    // Case: Hyphenated range (e.g., "66-69")
    const [start, end] = groupLabel.split("-").map((num) => parseInt(num.trim(), 10))
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
  } else {
    // Case: Single number (e.g., "45")
    const num = parseInt(groupLabel.trim(), 10)
    if (!isNaN(num)) {
      numbers.push(num)
    }
  }

  return numbers
}

function groupShipments(shipments, shipmentCounts) {
  if (!Array.isArray(shipments) || shipments.length === 0) {
    return [] // Return an empty array if shipments is not a valid array
  }

  const calculateTotalShipments = (parsedGroupLabel) => {
    return parsedGroupLabel.reduce((total, num) => {
      // Add the shipment count for this number, default to 0 if the number doesn't exist
      return total + (shipmentCounts[num] || 0)
    }, 0) // Start with a total of 0
  }

  const shipmentGroups = {}

  shipments.forEach((shipment) => {
    const groupLabel = shipment.groupLabel
    if (!shipmentGroups[groupLabel]) {
      const groupNumbers = parseGroupLabel(groupLabel)
      const count = calculateTotalShipments(groupNumbers)

      shipmentGroups[groupLabel] = {
        groupLabel: groupLabel,
        count,
        crystals: [],
        shipments: [],
        crystalIds: new Set(),
        subscription: shipment.subscription,
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
      count: group.count,
      subscription: group.subscription,
    }
  })
}
