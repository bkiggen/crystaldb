import React from "react"
import { useLocation } from "react-router-dom"
import { Box } from "@mui/material"
import { Link } from "react-router-dom"
import NavItem from "./NavItem"

const AppHeader = () => {
  const { pathname } = useLocation()

  return (
    <Box
      sx={{
        background: "#1c1c1c",
        height: "40px",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        padding: "12px 24px",
        marginBottom: "36px",
        position: "fixed",
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: "48px",
          paddingTop: "4px",
        }}
      >
        <Link to="/">
          <img src="/src/assets/favicon.ico" alt="logo" height="42px" />
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <NavItem linkTo="/" title="Shipments" pathname={pathname} />
        <NavItem linkTo="/crystals" title="Crystals" pathname={pathname} />
        <NavItem linkTo="/pre-builds" title="Pre-Builds" pathname={pathname} />
        <NavItem linkTo="/ship-day" title="ShipDay" pathname={pathname} />
      </Box>
    </Box>
  )
}

export default AppHeader
