import { Typography, TextField, Button, MenuItem, Box, LinearProgress } from "@mui/material"
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
  const {
    smartCheckSelectedPrebuilds,
    badPrebuilds,
    setPreBuildStore,
    smartCheckLoading,
    conflictingCyclePrebuilds,
  } = usePreBuildStore()

  const conflictIds = conflictingCyclePrebuilds.map((ccp) => ccp.id)
  const allIds = [...badPrebuilds.map((bpb) => bpb.id), ...conflictIds]
  const uniqueCount = new Set(allIds).size

  const handleSmartCheck = () => {
    const prebuildIds = highlightedPrebuilds.map((prebuild) => prebuild.id)
    smartCheckSelectedPrebuilds({ prebuildIds, month, year })
  }

  const handleClearCheck = () => {
    setPreBuildStore({ badPrebuilds: [] })
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
      {smartCheckLoading ? <LinearProgress /> : <hr />}
      <Box sx={{ display: "flex", gap: "12px", margin: "24px 0" }}>
        <Button variant="outlined" color="primary" fullWidth onClick={handleClearCheck}>
          Clear Check
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSmartCheck}
          disabled={smartCheckLoading}
          fullWidth
        >
          Smart Check
        </Button>
      </Box>
      {uniqueCount > 0 ? (
        <Box sx={{ display: "flex", margin: "24px", justifyContent: "center" }}>
          <Typography sx={{ color: "red" }}>
            Warning: {uniqueCount} of these staged shipments have errors
          </Typography>
        </Box>
      ) : null}
    </ModalContainer>
  )
}

export default BuildPrebuildModal
