import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import colors from "../../styles/colors"

type NavItemT = {
  linkTo: string
  title: string
  pathname: string
}

const NavItem = ({ linkTo, title, pathname }: NavItemT) => {
  const color = pathname === linkTo ? colors.pink : "white"

  return (
    <Box sx={{ marginRight: "48px" }}>
      <Link to={linkTo}>
        <Typography
          variant="body1"
          sx={{
            color,
            fontSize: "18px",
            fontWeight: "600",
            letterSpacing: "1px",

            "&:hover": {
              color: colors.pink,
            },
          }}
        >
          {title}
        </Typography>
      </Link>
    </Box>
  )
}

export default NavItem
