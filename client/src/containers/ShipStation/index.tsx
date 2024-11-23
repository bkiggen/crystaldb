import { useState } from "react"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import OrdersTab from "./OrdersTab"
import CustomersTab from "./CustomersTab"
import FulfillmentsTab from "./FulfillmentsTab"

const CrateJoy = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ paddingBottom: "80px" }}>
      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          <Tab label="Orders" sx={{ color: "white" }} />
          <Tab label="Customers" sx={{ color: "white" }} />
          <Tab label="Fulfillments" sx={{ color: "white" }} />
        </Tabs>
      </Box>

      {/* Tabs Content */}
      <Box sx={{ padding: "48px 24px" }}>
        {value === 0 && (
          <Box>
            <OrdersTab />
          </Box>
        )}
        {value === 1 && (
          <Box>
            <CustomersTab />
          </Box>
        )}
        {value === 2 && (
          <Box>
            <FulfillmentsTab />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CrateJoy
