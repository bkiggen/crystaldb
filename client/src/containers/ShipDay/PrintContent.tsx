import { Box, Button, Typography } from "@mui/material"
import { useRef } from "react"

const PrintContent = ({ data, month, year }) => {
  const printRef = useRef(null)

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const printWindow = window.open("", "_blank")

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              @page { 
                size: A4 portrait; 
                margin: 10mm; 
              }
              body {
                font-family: Arial, sans-serif;
                padding: 0;
                font-size: 9pt;
              }
              .container {
                column-count: 3;
                column-gap: 20px;
              }
              .group {
                break-inside: avoid;
                margin-bottom: 24px;
              }
              .group-label {
                font-weight: bold;
                margin-bottom: -4px;
              }
              ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
              }
              li {
                margin: 0;
                margin-bottom: -12px;
                padding: 0;
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
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
      {/* Hidden printable content */}
      <div ref={printRef} id="printable-content" style={{ display: "none" }}>
        <Typography variant="h4" align="center" gutterBottom>
          {month} {year}
        </Typography>
        <hr />
        <Box className="container">
          {data.map((item, index) => (
            <Box key={index} className="group">
              <Typography variant="body1" className="group-label">
                {item.groupLabel}
              </Typography>
              <ul>
                {item.crystals.map((crystal, idx) => (
                  <li>
                    <Typography key={`${idx}-${crystal.name}`} variant="body2">
                      {crystal.name}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>
      </div>
      {/* Only the button is visible on screen */}
      <Button variant="contained" onClick={handlePrint} sx={{ mt: 2 }}>
        Print Report
      </Button>
    </div>
  )
}

export default PrintContent
