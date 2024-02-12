import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { Box } from "@mui/material"

import AppHeader from "./components/AppHeader"

// import Home from "./containers/Home"
import Crystals from "./containers/Crystals/index"
import Shipments from "./containers/Shipments/index"
import PreBuilds from "./containers/PreBuilds/index"
import "./App.css"

const App = () => {
  return (
    <Router>
      <Box>
        <AppHeader />
        <Box sx={{ padding: "12px", paddingTop: "120px" }}>
          <Routes>
            <Route path="/" element={<Shipments />} />
            <Route path="/crystals" element={<Crystals />} />
            <Route path="/pre-builds" element={<PreBuilds />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App
