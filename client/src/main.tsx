import React from "react"
import ReactDOM from "react-dom/client"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import App from "./App.tsx"
import "./index.css"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
