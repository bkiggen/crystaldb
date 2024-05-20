import React from "react"
import { Box, Popover } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"

const LogoutMenu = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            position: "relative",
            height: "50px",
            width: "42px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              height: "42px",
              width: "42px",
              borderRadius: "50%",
              background: "transparent",
              border: "2px solid white",
              opacity: 0,
              transition: "0.2s all",
              zIndex: 101,

              "&:hover": {
                opacity: 0.3,
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              zIndex: 100,
              alignItems: "center",
              justifyContent: "center",
              height: "36px",
              width: "36px",
              borderRadius: "50%",
              border: "2px solid white",
              textDecoration: "none",
              cursor: "pointer",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            <AccountCircleIcon sx={{ height: "32px", width: "32px" }} />
          </Box>
        </Box>
      </Box>
      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          container={anchorEl}
          disableEnforceFocus
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{
            "& .item": {
              minWidth: "180px",
              padding: "10px 20px",
              transition: " 0.2s ease-in-out",
              margin: "6px 0",
              fontSize: "18px",

              "&:hover": {
                background: "var(--main-purple-lightest)",
              },
            },
          }}
        >
          {/* <div
            className="item"
            onClick={() => {
              setPasswordModalVisible(true)
              handleClose()
            }}
          >
            Change Password
          </div> */}
          <Box onClick={onLogout} className="item">
            Sign Out
          </Box>
        </Popover>
      )}
    </div>
  )
}

export default LogoutMenu
