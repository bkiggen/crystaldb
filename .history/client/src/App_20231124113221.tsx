import React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Box } from "@mui/material";
import "./App.css";
import Crystals from "./src/containers/Crystals";

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Crystals />}>
          <Route index element={<Crystals />} />
          <Route path="*" element={<Crystals />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
