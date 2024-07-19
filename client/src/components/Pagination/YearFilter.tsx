import { MenuItem, TextField } from "@mui/material"
import { textFieldStyles } from "../../styles/vars"

type YearFilterT = {
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

const YearFilter = ({ setSelectedYear }: YearFilterT) => {
  const filterOptions = createYearOptions()
  return (
    <TextField
      select
      id="filter"
      placeholder="Filter"
      defaultValue="All"
      onChange={(event) => {
        setSelectedYear(event.target.value)
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
