import { MenuItem, TextField } from "@mui/material"
import { textFieldStyles } from "../../styles/vars"

type YearFilterT = {
  selectedYear: string | null
  setSelectedYear: (arg: string) => void
}

const createYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const options = []

  for (let year = currentYear; year >= 2010; year--) {
    options.push({ label: year.toString(), value: year.toString() })
  }

  return options
}

const YearFilter = ({ setSelectedYear, selectedYear }: YearFilterT) => {
  const filterOptions = createYearOptions()
  return (
    <TextField
      select
      id="filter"
      placeholder="Filter"
      defaultValue="All"
      value={selectedYear || "All"}
      onChange={(event) => {
        const selectedYear = event.target.value === "All" ? null : event.target.value
        setSelectedYear(selectedYear)
      }}
      sx={{ ...textFieldStyles, minWidth: "200px" }}
    >
      <MenuItem key="All" value="All">
        All
      </MenuItem>
      {filterOptions.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default YearFilter
