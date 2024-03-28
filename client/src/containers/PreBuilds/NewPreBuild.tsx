import { useState, useEffect } from "react"

import { useFormik } from "formik"

import * as Yup from "yup"
import { Box, TextField, Button, FormControl, Grid, Typography, MenuItem } from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import type { PreBuildT } from "../../types/PreBuild"
import type { SubscriptionT } from "../../types/Subscription"

import { createPreBuild } from "../../api/preBuilds"
import CrystalSelect from "../../components/CrystalSelect"

type NewPreBuildT = {
  addPreBuild: (arg: PreBuildT) => void
  allSubscriptions: SubscriptionT[]
}

const NewPreBuild = ({ addPreBuild, allSubscriptions }: NewPreBuildT) => {
  const [cycleRangeMode, setCycleRangeMode] = useState(false)

  const initialValues: {
    cycle: number
    cycleRangeStart: number
    cycleRangeEnd: number
    crystalIds: number[]
    subscriptionId: number
  } = {
    cycle: 1,
    cycleRangeStart: 1,
    cycleRangeEnd: 5,
    crystalIds: [],
    subscriptionId: allSubscriptions[0]?.id || 0,
  }

  useEffect(() => {
    formik.setFieldValue("subscriptionId", allSubscriptions[0]?.id)
  }, [allSubscriptions]) // eslint-disable-line react-hooks/exhaustive-deps

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
    const newCycle = await createPreBuild(formData)
    addPreBuild(newCycle)
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
                id="cycle"
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
          <Grid item xs={12} sx={{ marginTop: "28px" }}>
            <FormControl fullWidth variant="outlined">
              <CrystalSelect formik={formik} />
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" variant="contained" color="primary">
            Create PreBuild
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default NewPreBuild
