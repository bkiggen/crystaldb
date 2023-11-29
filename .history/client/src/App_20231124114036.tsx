import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Crystals from "./src/containers/Crystals";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        >
          <img src="/src/assets/logo.png" alt="logo" />
        </Box>
        <Routes>
          <Route path="/" element={<Crystals />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
