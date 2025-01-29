import { Box, Button, Typography } from "@mui/material"
import React, { useRef } from "react"

const PrintContent = ({ data }) => {
  const printRef = useRef(null)

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const printWindow = window.open("", "_blank")

      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; }
              ul { list-style-type: none; padding: 0; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `)

      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <div>
      <div ref={printRef} id="printable-content">
        <h1>Data Report</h1>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {data.map((item, index) => (
            <Box key={index}>
              <Typography sx={{ fontSize: "24px" }}>{item.groupLabel}</Typography>
              <Box>
                {item.crystals.map((crystal, idx) => (
                  <Box key={idx}>{crystal.name}</Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </div>
      <Button variant="contained" onClick={handlePrint} style={{ marginTop: "10px" }}>
        Print Report
      </Button>
    </div>
  )
}

export default PrintContent
