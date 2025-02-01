import { useEffect } from "react"
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
} from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { monthOptions } from "../../lib/constants"

import { useCrystalStore } from "../../store/crystalStore"

import { useSubscriptionStore } from "../../store/subscriptionStore"
import { useShipmentStore } from "../../store/shipmentStore"

import ModalContainer from "../../components/Modals/ModalContainer"

const UpdateSelectedShipmentModal = ({
  selectedShipmentIds,
  onModalClose,
  resetSelectedShipmentIds,
}) => {
  const { crystals, fetchCrystals } = useCrystalStore()
  const { updateSelectedShipments } = useShipmentStore()
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const initialValues: {
    month: number
    year: number
    cycle: number
    crystalIds: number[]
    subscriptionId: number
    userCount: number
    groupLabel: string | number
  } = {
    month: undefined,
    year: undefined,
    cycle: undefined,
    crystalIds: undefined,
    subscriptionId: undefined,
    userCount: undefined,
    groupLabel: undefined,
  }

  useEffect(() => {
    fetchCrystals({ noPaging: true })
  }, [])

  const handleSubmit = async () => {
    const newData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(formik.values).filter(([_, value]) => value !== undefined),
    )

    await updateSelectedShipments({
      selectedIds: selectedShipmentIds,
      newData,
    })

    onModalClose()
    resetSelectedShipmentIds()
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  })

  return (
    <ModalContainer
      open
      onClose={() => onModalClose()}
      title="Update Selected Shipments"
      paperStyles={{ maxWidth: "600px", width: "100%" }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            background: colors.slateA4,
            padding: "24px",
            paddingTop: "48px",
            margin: "0 auto",
            borderRadius: "4px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <Typography
                sx={{ color: "white", fontSize: "14px", position: "absolute", top: "-8px" }}
              >
                Month
              </Typography>
              <TextField
                id="month"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("month")}
                inputProps={{ style: { color: "white" } }}
                sx={textFieldStyles}
                error={formik.touched.month && Boolean(formik.errors.month)}
                helperText={<>{formik.touched.month ? formik.errors.month : ""}</>}
              >
                {Object.keys(monthOptions).map((monthNumber) => (
                  <MenuItem key={monthNumber} value={parseInt(monthNumber, 10)}>
                    {monthOptions[monthNumber]?.long}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <Typography
                sx={{ color: "white", fontSize: "14px", position: "absolute", top: "-8px" }}
              >
                Year
              </Typography>
              <TextField
                id="year"
                variant="outlined"
                fullWidth
                type="number"
                {...formik.getFieldProps("year")}
                inputProps={{ style: { color: "white" } }}
                sx={textFieldStyles}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={<>{formik.touched.year ? formik.errors.year : ""}</>}
              />
            </Grid>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <Typography
                sx={{ color: "white", fontSize: "14px", position: "absolute", top: "-8px" }}
              >
                User Count
              </Typography>
              <TextField
                id="userCount"
                variant="outlined"
                fullWidth
                type="number"
                {...formik.getFieldProps("userCount")}
                sx={textFieldStyles}
                error={formik.touched.userCount && Boolean(formik.errors.userCount)}
                helperText={<>{formik.touched.userCount ? formik.errors.userCount : ""}</>}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "12px" }}>
            <Grid item xs={6} sx={{ position: "relative", marginTop: "25px" }}>
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
                  Cycle
                </Typography>
              </Box>
              <TextField
                id="month"
                variant="outlined"
                fullWidth
                type="number"
                {...formik.getFieldProps("cycle")}
                inputProps={{ style: { color: "white" } }}
                sx={textFieldStyles}
                error={formik.touched.cycle && Boolean(formik.errors.cycle)}
                helperText={<>{formik.touched.cycle ? formik.errors.cycle : ""}</>}
              />
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
                  error={formik.touched.subscriptionId && Boolean(formik.errors.subscriptionId)}
                  helperText={
                    <>{formik.touched.subscriptionId ? formik.errors.subscriptionId : ""}</>
                  }
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
          <Grid item xs={12} sx={{ position: "relative", marginTop: "24px" }}>
            <Typography
              sx={{
                fontSize: "14px",
                marginBottom: "4px",
                color: "white",
              }}
            >
              Group Label
            </Typography>
            <TextField
              id="groupLabel"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("groupLabel")}
              inputProps={{ style: { color: "white" } }}
              sx={textFieldStyles}
              error={formik.touched.groupLabel && Boolean(formik.errors.groupLabel)}
              helperText={<>{formik.touched.groupLabel ? formik.errors.groupLabel : ""}</>}
            />
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ marginTop: "24px", display: "flex", alignItems: "center" }}
          >
            <Grid item xs={12} sx={{ marginTop: "12px", marginBottom: "24px" }}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  disablePortal
                  id="crystal-select"
                  disableCloseOnSelect
                  multiple
                  value={formik.values.crystalIds || []}
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
                        sx={{ color: "white", textTransform: "capitalize" }}
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

          <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </Box>
      </form>
    </ModalContainer>
  )
}

export default UpdateSelectedShipmentModal
