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
  Switch,
  MenuItem,
} from "@mui/material"
// import CloseIcon from "@mui/icons-material/Close";

import { monthOptions } from "../../lib/constants"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { getAllCrystals } from "../../graphql/crystals"

import type { CycleT } from "../../types/Cycle"
import type { CrystalT } from "../../types/Crystal"

import { createCycle } from "../../graphql/cycles"

type NewCycleT = {
  addCycle: (arg: CycleT) => void
}

const NewCycle = ({ addCycle }: NewCycleT) => {
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
  } = {
    month: currentMonth,
    year: currentYear,
    cycle: 1,
    cycleRangeStart: 1,
    cycleRangeEnd: 5,
    crystalIds: [],
  }

  useEffect(() => {
    const fetchCrystals = async () => {
      const response = await getAllCrystals()
      setAllCrystals(response || [])
    }
    fetchCrystals()
  }, [])

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
    const newCycle = await createCycle(formData)
    addCycle(newCycle)
    formik.resetForm()
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
          background: colors.slate,
          border: "1px solid #fff",
          padding: "24px",
          paddingTop: "48px",
          margin: "0 auto",
          marginBottom: "48px",
          borderRadius: "4px",
          maxWidth: "1200px",
          width: "90%",
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
                (Change Type)
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
        <Grid container spacing={2} sx={{ marginTop: "24px" }}>
          <Grid item xs={8}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                disablePortal
                id="crystal-select"
                multiple
                defaultValue={formik.values.crystalIds}
                options={allCrystals?.map((c) => {
                  return c.id
                })}
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

        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary">
            Create Cycle
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default NewCycle
