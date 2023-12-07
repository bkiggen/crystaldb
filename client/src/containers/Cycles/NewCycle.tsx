import React, { useState, useEffect } from "react"
import { useFormik } from "formik"

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
} from "@mui/material"
// import CloseIcon from "@mui/icons-material/Close";

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

  const initialValues: {
    calendarMonth: number
    cycleMonth: number
    crystalIds: number[]
  } = {
    calendarMonth: 1,
    cycleMonth: 1,
    crystalIds: [],
  }

  useEffect(() => {
    ;(async () => {
      const response = await getAllCrystals()
      setAllCrystals(response || [])
    })()
  }, [])

  const validationSchema: Yup.Schema<typeof initialValues> = Yup.object({
    calendarMonth: Yup.number().required("Calendar Month is required").integer().min(1).max(12),
    cycleMonth: Yup.number().required("Cycle Month is required").integer().min(1).max(52),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
  })

  const handleSubmit = async (formData: typeof initialValues) => {
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
          background: "rgba(70, 90, 126, 0.4)",
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
              sx={{ color: "white", fontSize: "12px", position: "absolute", top: "-4px" }}
            >
              Shipment Month
            </Typography>
            <TextField
              id="month"
              variant="outlined"
              fullWidth
              type="number"
              {...formik.getFieldProps("calendarMonth")}
              inputProps={{ style: { color: "white" } }}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={4} sx={{ position: "relative" }}>
            <Typography
              sx={{ color: "white", fontSize: "12px", position: "absolute", top: "-4px" }}
            >
              Shipment Year
            </Typography>
            <TextField
              id="month"
              variant="outlined"
              fullWidth
              type="number"
              {...formik.getFieldProps("calendarMonth")}
              inputProps={{ style: { color: "white" } }}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={4} sx={{ position: "relative" }}>
            <Typography
              sx={{ color: "white", fontSize: "12px", position: "absolute", top: "-4px" }}
            >
              Subscriber Cycle Month
            </Typography>
            <TextField
              id="month"
              variant="outlined"
              fullWidth
              type="number"
              {...formik.getFieldProps("cycleMonth")}
              inputProps={{ style: { color: "white" } }}
              sx={textFieldStyles}
            />
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
          <Grid item xs={4} sx={{ position: "relative" }}>
            <Typography
              sx={{ color: "white", fontSize: "12px", position: "absolute", top: "-4px" }}
            >
              Subscriber Cycle Month Range
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="month"
                  variant="outlined"
                  fullWidth
                  type="number"
                  {...formik.getFieldProps("calendarMonthStart")}
                  inputProps={{ style: { color: "white" } }}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="month"
                  variant="outlined"
                  fullWidth
                  type="number"
                  {...formik.getFieldProps("calendarMonthEnd")}
                  inputProps={{ style: { color: "white" } }}
                  sx={textFieldStyles}
                />
              </Grid>
            </Grid>
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
