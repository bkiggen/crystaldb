import React, { useState, useEffect } from "react"

import dayjs from "dayjs"
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
} from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { monthOptions } from "../../lib/constants"

import { getAllCrystals } from "../../api/crystals"
import { getAllSubscriptions } from "../../api/subscriptions"
import { updateShipment, deleteShipment } from "../../api/shipments"

import { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"
import type { SubscriptionT } from "../../types/Subscription"

import ModalContainer from "../../components/Modals/ModalContainer"

type UpdateShipmentModalT = {
  shipment: ShipmentT
  setSelectedShipment: (shipment: ShipmentT) => void
  fetchShipments: (args: Record<string, unknown>) => void
}

const UpdateShipmentModal = ({
  shipment,
  setSelectedShipment,
  fetchShipments,
}: UpdateShipmentModalT) => {
  const [allCrystals, setAllCrystals] = useState<CrystalT[]>([])
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionT[]>([])
  const [cycleRangeMode, setCycleRangeMode] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const currentYear = dayjs().year()
  const currentMonth = dayjs().month()

  const fetchSubscriptionTypes = async () => {
    const response = await getAllSubscriptions()
    setAllSubscriptions(response || [])
  }

  useEffect(() => {
    fetchSubscriptionTypes()
  }, [])

  const handleDelete = async () => {
    await deleteShipment(shipment.id)
    setSelectedShipment(null)
    fetchShipments({})
  }

  const initialValues: {
    month: number
    year: number
    cycle: number
    cycleRangeStart: number
    cycleRangeEnd: number
    crystalIds: number[]
    subscriptionId: number
  } = {
    month: currentMonth,
    year: currentYear,
    cycle: shipment.cycle,
    cycleRangeStart: shipment.cycleRangeStart,
    cycleRangeEnd: shipment.cycleRangeEnd,
    crystalIds: shipment.crystals.map((c) => c.id),
    subscriptionId: shipment.subscription.id || 1,
  }

  useEffect(() => {
    const fetchCrystals = async () => {
      const response = await getAllCrystals({ noPaging: true })
      setAllCrystals(response.data || [])
    }
    fetchCrystals()
  }, [])

  useEffect(() => {
    if (shipment.cycleRangeStart) {
      setCycleRangeMode(true)
      formik.setFieldValue("cycleRangeStart", shipment.cycleRangeStart)
      formik.setFieldValue("cycleRangeEnd", shipment.cycleRangeEnd)
    }
  }, [shipment, shipment.cycleRangeEnd]) // eslint-disable-line react-hooks/exhaustive-deps

  const validationSchema = Yup.object({
    month: Yup.number().required("Month is required").integer().min(1).max(12),
    year: Yup.number()
      .required("Year is required")
      .integer()
      .min(2016)
      .max(currentYear + 1),
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
    await updateShipment({ ...formData, id: shipment.id })
    setSelectedShipment(null)
    fetchShipments({})
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <ModalContainer
      open
      onClose={() => setSelectedShipment(null)}
      title="Update shipment"
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
            <Grid item xs={6} sx={{ position: "relative" }}>
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
              >
                {Object.keys(monthOptions).map((monthNumber) => (
                  <MenuItem key={monthNumber} value={parseInt(monthNumber, 10)}>
                    {monthOptions[monthNumber]?.long}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sx={{ position: "relative" }}>
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
                  {allSubscriptions.map((subscription) => (
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
            <Grid item xs={12} sx={{ marginTop: "12px", marginBottom: "24px" }}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  disablePortal
                  id="crystal-select"
                  disableCloseOnSelect
                  multiple
                  defaultValue={formik.values.crystalIds}
                  value={formik.values.crystalIds}
                  options={allCrystals?.map((c) => {
                    return c.id
                  })}
                  getOptionLabel={(option) => {
                    const crystal = allCrystals.find((c) => c.id === option)
                    return crystal ? crystal.name : ""
                  }}
                  onChange={(_, value) => {
                    formik.setFieldValue("crystalIds", value)
                  }}
                  renderTags={(value: number[], getTagProps) => {
                    return value.map((option: number, index: number) => (
                      <Chip
                        variant="outlined"
                        label={allCrystals.find((c) => c.id === option)?.name}
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
                      <ListItemText primary={allCrystals.find((c) => c.id === option)?.name} />
                    </li>
                  )}
                  filterOptions={(options, params) => {
                    const filtered = options.filter((option) => {
                      const crystal = allCrystals.find((c) => c.id === option)
                      if (!crystal) return
                      return crystal.name.toLowerCase().includes(params.inputValue.toLowerCase())
                    })

                    return filtered
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (deleteConfirm) {
                  handleDelete()
                } else {
                  setDeleteConfirm(true)
                }
              }}
            >
              {deleteConfirm ? "Confirm Delete" : "Delete"}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </Box>
      </form>
    </ModalContainer>
  )
}

export default UpdateShipmentModal