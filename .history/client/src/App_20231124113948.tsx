import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Crystals from "./src/containers/Crystals";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Box>
        <img src="https://i.imgur.com/4MmX3jv.png" alt="logo" />
        <Routes>
          <Route path="/" element={<Crystals />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
