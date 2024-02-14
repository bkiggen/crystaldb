import React, { useState, useEffect } from "react"

import { useFormik } from "formik"
import dayjs from "dayjs"

import * as Yup from "yup"
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
// import CloseIcon from "@mui/icons-material/Close";

import { monthOptions } from "../../lib/constants"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { getAllCrystals } from "../../api/crystals"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"
import type { SubscriptionT } from "../../types/Subscription"

import { createShipment } from "../../api/shipments"
import ColorIndicator from "../../components/ColorIndicator"

type NewShipmentT = {
  addShipment: (arg: ShipmentT) => void
  allSubscriptions: SubscriptionT[]
}

const NewShipment = ({ addShipment, allSubscriptions }: NewShipmentT) => {
  const [allCrystals, setAllCrystals] = useState<CrystalT[]>([])

  const [cycleRangeMode, setCycleRangeMode] = useState(false)

  const currentYear = dayjs().year()
  const currentMonth = dayjs().month()

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
    cycle: 1,
    cycleRangeStart: 1,
    cycleRangeEnd: 5,
    crystalIds: [],
    subscriptionId: allSubscriptions[0]?.id || 0,
  }

  useEffect(() => {
    const fetchCrystals = async () => {
      const response = await getAllCrystals({ noPaging: true })
      setAllCrystals(response.data || [])
    }
    fetchCrystals()
  }, [])

  const resetSubType = () => {
    formik.setFieldValue("subscriptionId", allSubscriptions[0]?.id)
  }

  useEffect(() => {
    resetSubType()
  }, [allSubscriptions]) // eslint-disable-line react-hooks/exhaustive-deps

  const validationSchema = Yup.object({
    month: Yup.number().required("Month is required").integer().min(0).max(11),
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
    const newCycle = await createShipment(formData)
    addShipment(newCycle)
    await formik.resetForm()
    resetSubType()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          background: colors.slateA4,
          border: "1px solid #fff",
          padding: "24px",
          paddingTop: "48px",
          margin: "0 auto",
          marginBottom: "48px",
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
            />
          </Grid>
          <Grid item xs={4} sx={{ position: "relative" }}>
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
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "grey",
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
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ marginTop: "24px", display: "flex", alignItems: "center" }}
        >
          <Grid item xs={8} sx={{ marginTop: "28px" }}>
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
                  return value.map((option: number, index: number) => {
                    const crystal = allCrystals.find((c) => c.id === option)

                    return (
                      <Chip
                        variant="outlined"
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ColorIndicator indicatorValue={crystal?.color?.hex} />
                            {crystal?.name}
                          </Box>
                        }
                        {...getTagProps({ index })}
                        sx={{ color: "white" }}
                      />
                    )
                  })
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
                renderOption={(props, option) => {
                  const crystal: CrystalT = allCrystals.find((c) => c.id === option)
                  return (
                    <li {...props}>
                      <ColorIndicator indicatorValue={crystal?.color?.hex} />
                      <ListItemText primary={crystal?.name} />
                    </li>
                  )
                }}
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
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <Typography
                sx={{
                  fontSize: "14px",
                  marginBottom: "4px",
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

        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary">
            Create Shipment
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default NewShipment
