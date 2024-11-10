import { Typography, TextField, Button, MenuItem } from "@mui/material"
import { monthOptions } from "../../lib/constants"
import ModalContainer from "../../components/Modals/ModalContainer"
import { textFieldStyles } from "../../styles/vars"

const BuildPrebuildModal = ({
  buildModalVisible,
  setBuildModalVisible,
  highlightedPrebuilds,
  month,
  setMonth,
  setYear,
  year,
  confirmBuildPrebuilds,
}) => {
  return (
    <ModalContainer
      open={buildModalVisible}
      onClose={() => setBuildModalVisible(false)}
      paperStyles={{ maxWidth: "400px" }}
    >
      <Typography variant="h5" sx={{ marginBottom: "32px", color: "white" }}>
        Are you sure you want to build
        {" " + highlightedPrebuilds.length} selected prebuild
        {highlightedPrebuilds.length > 1 ? "s" : ""}?
      </Typography>
      <TextField
        label="Month"
        select
        value={month}
        onChange={(e) => setMonth(parseInt(e.target.value))}
        fullWidth
        sx={{ ...textFieldStyles, marginBottom: "16px" }}
      >
        {Object.keys(monthOptions).map((key) => (
          <MenuItem key={key} value={key}>
            {monthOptions[key].long}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Year"
        type="number"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
        fullWidth
        sx={{ ...textFieldStyles, marginBottom: "16px" }}
      />
      <Button variant="contained" color="primary" onClick={confirmBuildPrebuilds} fullWidth>
        Confirm
      </Button>
    </ModalContainer>
  )
}

export default BuildPrebuildModal
