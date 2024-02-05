import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { Box } from "@mui/material"

import Header from "./components/Header"

import Home from "./containers/Home"
import Crystals from "./containers/Crystals/index"
import Shipments from "./containers/Shipments/index"
import Build from "./containers/Build/index"
import "./App.css"

const App = () => {
  return (
    <Router>
      <Box>
        <Header />
        <Box sx={{ padding: "12px", paddingTop: "120px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crystals" element={<Crystals />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/build" element={<Build />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App
