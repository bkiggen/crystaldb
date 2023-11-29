import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Crystals from "./src/containers/Crystals";
import "./App.css";

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Crystals />} />
      </Routes>
    </Box>
  );
};

export default App;
