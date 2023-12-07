import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
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
          marginRight: "36px",
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
        <Box sx={{ marginRight: "36px" }}>
          <Link to="/crystals">
            <Typography variant="h6">Crystals</Typography>
          </Link>
        </Box>
        <Box sx={{ marginRight: "36px" }}>
          <Link to="/cycles">
            <Typography variant="h6">Cycles</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
