import { TextField } from "@mui/material"
import { textFieldStyles } from "../../styles/vars"

type CycleFilterT = {
  selectedCycle: string | null
  setSelectedCycle: (arg: string) => void
}

const CycleFilter = ({ setSelectedCycle, selectedCycle }: CycleFilterT) => {
  return (
    <TextField
      type="number"
      id="cycle-filter"
      placeholder="Cycle"
      value={selectedCycle || ""}
      onChange={(event) => {
        const cycle = event.target.value ? event.target.value : null
        setSelectedCycle(cycle)
      }}
      sx={{ ...textFieldStyles, width: "92px" }}
    />
  )
}

export default CycleFilter
