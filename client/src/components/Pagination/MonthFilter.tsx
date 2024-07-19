import { MenuItem, TextField } from "@mui/material"
import { textFieldStyles } from "../../styles/vars"
import { monthOptions } from "../../lib/constants"

type MonthFilterT = {
  setSelectedMonth: (arg: string) => void
}

const MonthFilter = ({ setSelectedMonth }: MonthFilterT) => {
  const filterOptions = Object.keys(monthOptions).map((monthNumber) => {
    return {
      label: monthOptions[monthNumber].long,
      value: monthNumber,
    }
  })

  return (
    <TextField
      select
      id="filter"
      placeholder="Filter"
      defaultValue="All"
      onChange={(event) => {
        setSelectedMonth(event.target.value)
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

export default MonthFilter
