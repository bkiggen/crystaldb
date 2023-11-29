import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import "./App.css";
import Crystals from "./src/containers/Crystals";

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Crystals />} />
        {/* Define other routes here */}
      </Routes>
    </Box>
  );
};

export default App;
