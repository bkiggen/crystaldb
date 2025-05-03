import { Typography, TextField, Button, MenuItem, Box } from "@mui/material"
import { monthOptions } from "../../lib/constants"
import ModalContainer from "../../components/Modals/ModalContainer"
import { textFieldStyles } from "../../styles/vars"
import { usePreBuildStore } from "../../store/preBuildStore"

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
  const { smartCheckSelectedPrebuilds, badPrebuildIds, setPreBuildStore } = usePreBuildStore()

  const badPrebuildIdCount = badPrebuildIds.length

  const handleSmartCheck = () => {
    const prebuildIds = highlightedPrebuilds.map((prebuild) => prebuild.id)
    smartCheckSelectedPrebuilds({ prebuildIds, month, year })
  }

  const handleClearCheck = () => {
    setPreBuildStore({ badPrebuildIds: [] })
  }

  return (
    <ModalContainer
      open={buildModalVisible}
      onClose={() => setBuildModalVisible(false)}
      paperStyles={{ maxWidth: "500px" }}
    >
      <Typography variant="h5" sx={{ marginBottom: "32px", color: "white" }}>
        Are you sure you want to build
        {" " + highlightedPrebuilds.length} selected shipment
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
        sx={{ ...textFieldStyles, marginBottom: "48px" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={confirmBuildPrebuilds}
        fullWidth
        sx={{ marginBottom: "24px" }}
      >
        Confirm
      </Button>
      <hr />
      <Box sx={{ display: "flex", gap: "12px", margin: "24px 0" }}>
        <Button variant="outlined" color="primary" fullWidth onClick={handleClearCheck}>
          Clear Check
        </Button>
        <Button variant="contained" color="primary" onClick={handleSmartCheck} fullWidth>
          Smart Check
        </Button>
      </Box>
      {badPrebuildIdCount ? (
        <Box sx={{ display: "flex", margin: "24px", justifyContent: "center" }}>
          <Typography sx={{ color: "red" }}>
            Warning: {badPrebuildIdCount} of these staged shipments have errors
          </Typography>
        </Box>
      ) : null}
    </ModalContainer>
  )
}

export default BuildPrebuildModal
