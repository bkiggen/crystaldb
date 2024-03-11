import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { Box } from "@mui/material"

import AppHeader from "./components/AppHeader"

import Crystals from "./containers/Crystals/index"
import Shipments from "./containers/Shipments/index"
import PreBuilds from "./containers/PreBuilds/index"
import ShipDay from "./containers/ShipDay/index"
import Reports from "./containers/Reports/index"
import Login from "./containers/Login/index"

import "./App.css"

const App = () => {
  return (
    <Router>
      <Box>
        <AppHeader />
        <Box sx={{ padding: "12px", paddingTop: "120px" }}>
          <Routes>
            <Route path="/" element={<Reports />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/crystals" element={<Crystals />} />
            <Route path="/pre-builds" element={<PreBuilds />} />
            <Route path="/ship-day" element={<ShipDay />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App
