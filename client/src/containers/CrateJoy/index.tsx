import { useState } from "react"
import UsersTab from "./UsersTab"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import SubscriptionsTab from "./SubscriptionsTab"
import ShipmentsTab from "./ShipmentsTab"

const CrateJoy = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ paddingBottom: "80px", paddingX: "24px" }}>
      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="Basic Tabs Example">
          <Tab label="Users" sx={{ color: "white" }} />
          <Tab label="Subscriptions" sx={{ color: "white" }} />
          <Tab label="Shipments" sx={{ color: "white" }} />
        </Tabs>
      </Box>

      {/* Tabs Content */}
      <Box sx={{ paddingTop: "48px" }}>
        {value === 0 && (
          <Box>
            <UsersTab />
          </Box>
        )}
        {value === 1 && (
          <Box>
            <SubscriptionsTab />
          </Box>
        )}
        {value === 2 && (
          <Box>
            <ShipmentsTab />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CrateJoy
