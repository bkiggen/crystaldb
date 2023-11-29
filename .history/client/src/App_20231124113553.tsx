import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Crystals from "./src/containers/Crystals";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Box>
        <Routes>
          <Route path="/" element={<Crystals />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
