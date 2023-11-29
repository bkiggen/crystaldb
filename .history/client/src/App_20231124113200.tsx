import React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Box } from "@mui/material";
import "./App.css";
import Crystals from "./src/containers/Crystals";

const App = () => {
  return (
    <Router>
      <Box sx={{}}>
        <Switch>
          <Route exact path="/" component={Crystals} />
          <Route exact path="/crystals" component={Crystals} />
          {/* Add routes for other components */}
        </Switch>
      </Box>
    </Router>
  );
};

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
