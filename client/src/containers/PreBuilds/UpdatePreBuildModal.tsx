import { useState, useEffect } from "react"
import ModalContainer from "../../components/Modals/ModalContainer"

import * as Yup from "yup"
import { useFormik } from "formik"

import {
  Box,
  TextField,
  Button,
  FormControl,
  Chip,
  Grid,
  ListItemText,
  Autocomplete,
  Typography,
  MenuItem,
  Popper,
} from "@mui/material"

import { textFieldStyles } from "../../styles/vars"

import { useCrystalStore } from "../../store/crystalStore"
import { usePreBuildStore } from "../../store/preBuildStore"
import { useSubscriptionStore } from "../../store/subscriptionStore"

import { PreBuildT } from "../../types/PreBuild"

import ConfirmDialogue from "../../components/ConfirmDialogue"

type UpdatePreBuildModalT = {
  preBuild: PreBuildT
  setSelectedPreBuild: (preBuild: PreBuildT) => void
}

const UpdatePreBuildModal = ({ preBuild, setSelectedPreBuild }: UpdatePreBuildModalT) => {
  const { crystals, fetchCrystals } = useCrystalStore()
  const { updatePreBuild, deletePreBuild } = usePreBuildStore()
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()

  const [cycleRangeMode, setCycleRangeMode] = useState(false)
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const onDelete = async () => {
    await deletePreBuild(preBuild.id)

    setSelectedPreBuild(null)
  }

  const initialValues: {
    cycle: number
    cycleRangeStart: number
    cycleRangeEnd: number
    crystalIds: number[]
    subscriptionId: number
  } = {
    cycle: preBuild.cycle,
    cycleRangeStart: preBuild.cycleRangeStart,
    cycleRangeEnd: preBuild.cycleRangeEnd,
    crystalIds: preBuild.crystals.map((c) => c.id),
    subscriptionId: preBuild.subscription.id,
  }

  useEffect(() => {
    fetchCrystals({ noPaging: true })
  }, [])

  const validationSchema = Yup.object({
    cycle: Yup.number().nullable().integer().min(1),
    cycleRangeStart: Yup.number().nullable().integer().min(1),
    cycleRangeEnd: Yup.number().nullable().integer().min(1),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
  }).test(
    "cycle-or-cycleRange",
    "Either cycle or cycle range (start and end) must be provided",
    (values) => {
      const { cycle, cycleRangeStart, cycleRangeEnd } = values
      const isCycleValid = cycle !== null
      const isCycleRangeValid = cycleRangeStart !== null && cycleRangeEnd !== null

      return isCycleValid || isCycleRangeValid
    },
  )

  const handleSubmit = async (formData: typeof initialValues) => {
    if (cycleRangeMode) {
      formData.cycle = null
    }
    if (!cycleRangeMode) {
      formData.cycleRangeStart = null
      formData.cycleRangeEnd = null
    }

    updatePreBuild({ ...formData, id: preBuild.id })
    setSelectedPreBuild(null)
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    formik.setValues({
      cycle: preBuild.cycle,
      cycleRangeStart: preBuild.cycleRangeStart,
      cycleRangeEnd: preBuild.cycleRangeEnd,
      crystalIds: preBuild.crystals.map((c) => c.id),
      subscriptionId: preBuild.subscription.id,
    })
  }, [preBuild]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ModalContainer open onClose={() => setSelectedPreBuild(null)} title="Update Pre-Build">
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            padding: "24px",
            margin: "0 auto",
            borderRadius: "4px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{ marginTop: "25px", position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: "-8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {cycleRangeMode ? "Cycle Range" : "Cycle"}
                </Typography>
                <Button
                  onClick={() => setCycleRangeMode((prev) => !prev)}
                  sx={{
                    margin: 0,
                    height: "14px",
                    marginLeft: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    color: "whitesmoke",
                    border: "none !important",
                    outline: "none !important",
                  }}
                >
                  ({cycleRangeMode ? "Change to Single" : "Change to Range"})
                </Button>
              </Box>
              {cycleRangeMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="cycleRangeStart"
                      variant="outlined"
                      fullWidth
                      type="number"
                      {...formik.getFieldProps("cycleRangeStart")}
                      inputProps={{ style: { color: "white" } }}
                      sx={textFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="cycleRangeEnd"
                      variant="outlined"
                      fullWidth
                      type="number"
                      {...formik.getFieldProps("cycleRangeEnd")}
                      inputProps={{ style: { color: "white" } }}
                      sx={textFieldStyles}
                    />
                  </Grid>
                </Grid>
              ) : (
                <TextField
                  id="month"
                  variant="outlined"
                  fullWidth
                  type="number"
                  {...formik.getFieldProps("cycle")}
                  inputProps={{ style: { color: "white" } }}
                  sx={textFieldStyles}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <Typography
                  sx={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "white",
                  }}
                >
                  Subscription Type
                </Typography>
                <TextField
                  select
                  id="subscriptionId"
                  {...formik.getFieldProps("subscriptionId")}
                  sx={textFieldStyles}
                >
                  {subscriptions.map((subscription) => (
                    <MenuItem key={subscription.id} value={subscription.id}>
                      {subscription.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ marginTop: "24px", display: "flex", alignItems: "center" }}
          >
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  id="crystal-select"
                  disableCloseOnSelect
                  multiple
                  defaultValue={formik.values.crystalIds}
                  value={formik.values.crystalIds}
                  options={crystals?.map((c) => {
                    return c.id
                  })}
                  getOptionLabel={(option) => {
                    const crystal = crystals.find((c) => c.id === option)
                    return crystal ? crystal.name : ""
                  }}
                  onChange={(_, value) => {
                    formik.setFieldValue("crystalIds", value)
                  }}
                  renderTags={(value: number[], getTagProps) => {
                    return value.map((option: number, index: number) => (
                      <Chip
                        variant="outlined"
                        label={crystals.find((c) => c.id === option)?.name}
                        {...getTagProps({ index })}
                        sx={{ color: "white" }}
                      />
                    ))
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Crystals"
                        placeholder="Search"
                        sx={textFieldStyles}
                      />
                    )
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <ListItemText primary={crystals.find((c) => c.id === option)?.name} />
                    </li>
                  )}
                  // varies from other similar elements. Also, disablePortal is false here
                  PopperComponent={(popperProps) => (
                    <Popper {...popperProps} placement="top" style={{ zIndex: 1300 }} />
                  )}
                  filterOptions={(options, params) => {
                    const filtered = options.filter((option) => {
                      const crystal = crystals.find((c) => c.id === option)
                      if (!crystal) return
                      return crystal.name.toLowerCase().includes(params.inputValue.toLowerCase())
                    })

                    return filtered
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "48px" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteConfirmVisible(true)}
              sx={{ marginRight: "16px" }}
            >
              X
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update PreBuild
            </Button>
          </Box>
        </Box>
        <ConfirmDialogue
          open={deleteConfirmVisible}
          onClose={() => setDeleteConfirmVisible(false)}
          onConfirm={onDelete}
        />
      </form>
    </ModalContainer>
  )
}

export default UpdatePreBuildModal
