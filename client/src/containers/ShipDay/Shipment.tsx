import { useState } from "react"
import { Link } from "react-router-dom"
import { Box, TextField, Typography } from "@mui/material"
import ColorIndicator from "../../components/ColorIndicator"
import colors from "../../styles/colors"
import UpdateShipmentModal from "../Shipments/UpdateShipmentModal"

const Shipment = ({ shipmentGroup }) => {
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [editing, setEditing] = useState(false)

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
          margin: "12px",
          background: colors.slateA4,
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          width: "20%",
          alignItems: "flex-start",
        }}
      >
        <Link
          to={`/shipments?searchTerm=${shipmentGroup.groupLabel}`}
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
              fontSize: "2em",
              color: "white",
            }}
          >
            {shipmentGroup.groupLabel || "No Group"}
          </Typography>
        </Link>
        <Box
          sx={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {editing ? (
            <TextField
              sx={{ "*": { color: "white", textAlign: "center" } }}
              onBlur={() => setEditing(false)}
              defaultValue={subscriberCount}
              onChange={(e) => setSubscriberCount(parseInt(e.target.value))}
              type="number"
            />
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                // color: shipment?.userCountIsNew ? "red" : "white",
                color: "white",
                marginRight: "4px",
                width: "100%",
                fontSize: "1em",
              }}
              onClick={() => {
                setEditing(true)
              }}
            >
              Count: {subscriberCount.toLocaleString()}
            </Typography>
          )}
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
