import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

import { Box } from "@mui/material"

import { handleLogout } from "../../api/users"

import CrystalImage from "../../assets/crystal.png"
import NavItem from "./NavItem"
import LogoutButton from "./LogoutButton"

const AppHeader = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem("userToken")

  const onLogout = async () => {
    handleLogout()
    navigate("/login")
  }

  return (
    <Box
      sx={{
        background: "#1c1c1c",
        height: "40px",
        width: "calc(100% - 50px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginRight: "36px",
            paddingTop: "4px",
          }}
        >
          <Link to="/">
            <img src={CrystalImage} alt="logo" height="42px" />
          </Link>
        </Box>
        {token && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <NavItem linkTo="/staging" title="Staging" pathname={pathname} />
            <NavItem linkTo="/ship-day" title="ShipDay" pathname={pathname} />
            <NavItem linkTo="/crystals" title="Crystals" pathname={pathname} />
            <NavItem linkTo="/shipments" title="Shipments" pathname={pathname} />
            <NavItem linkTo="/crate-joy" title="CrateJoy" pathname={pathname} />
            <NavItem linkTo="/ship-station" title="ShipStation" pathname={pathname} />
          </Box>
        )}
      </Box>
      <Box>{token && <LogoutButton onLogout={onLogout} />}</Box>
    </Box>
  )
}

export default AppHeader
