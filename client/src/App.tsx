import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { Box } from "@mui/material"

import AppHeader from "./components/AppHeader"

import Crystals from "./containers/Crystals/index"
import Shipments from "./containers/Shipments/index"
import PreBuilds from "./containers/Staging/index"
import ShipDay from "./containers/ShipDay/index"
import CrateJoy from "./containers/CrateJoy/index"
import ShipStation from "./containers/ShipStation/index"
import Reports from "./containers/Reports/index"
import Login from "./containers/Login/index"

import { useStore } from "./store/utilityStore"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import "./App.css"

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  const isFullScreen = useStore((state) => {
    return state.isFullScreen
  })
  return (
    <>
      <ToastContainer />
      <Router>
        <Box>
          {!isFullScreen && <AppHeader />}
          <Box sx={{ padding: "12px", paddingTop: isFullScreen ? "20px" : "120px" }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shipments"
                element={
                  <ProtectedRoute>
                    <Shipments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crystals"
                element={
                  <ProtectedRoute>
                    <Crystals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pre-builds"
                element={
                  <ProtectedRoute>
                    <PreBuilds />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ship-day"
                element={
                  <ProtectedRoute>
                    <ShipDay />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crate-joy"
                element={
                  <ProtectedRoute>
                    <CrateJoy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ship-station"
                element={
                  <ProtectedRoute>
                    <ShipStation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <h1>Not Found</h1>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </>
  )
}

export default App
