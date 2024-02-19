import React, { useState, useEffect } from "react"

import { useFormik } from "formik"
import dayjs from "dayjs"

import * as Yup from "yup"
import { Box, TextField, Button, FormControl, Grid, Typography, MenuItem } from "@mui/material"

import { monthOptions } from "../../lib/constants"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import type { ShipmentT } from "../../types/Shipment"
import type { SubscriptionT } from "../../types/Subscription"
import type { PreBuildT } from "../../types/PreBuild"

import { getAllPreBuilds } from "../../api/preBuilds"
import { createShipment } from "../../api/shipments"

import CrystalSelect from "../../components/CrystalSelect"
import SmartSelect from "../../components/SmartSelect"
import CrystalChip from "../../components/SmartSelect/CrystalChip"

type NewShipmentT = {
  addShipment: (arg: ShipmentT) => void
  allSubscriptions: SubscriptionT[]
}

const NewShipment = ({ addShipment, allSubscriptions }: NewShipmentT) => {
  const [cycleRangeMode, setCycleRangeMode] = useState(false)
  const [preBuilds, setPreBuilds] = useState<PreBuildT[] | null>(null)
  const [selectedPreBuildCrystals, setSelectedPreBuildCrystals] = useState<CrystalT[]>([])

  const fetchPreBuilds = async (args) => {
    const response = await getAllPreBuilds(args)
    setPreBuilds(response.data)
  }

  useEffect(() => {
    fetchPreBuilds({})
  }, [])

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
    const newShipment = await createShipment(formData)
    addShipment(newShipment)
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
        <Box
          sx={{ width: "100%", height: "1px", background: "lightgrey", margin: "48px 0 24px 0" }}
        />
        <Grid container sx={{ marginBottom: "24px" }}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <SmartSelect formik={formik} />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ width: "100%" }}>
              <TextField
                placeholder="PreBuild"
                select
                onChange={(e) => {
                  const pb = preBuilds?.find((pb) => {
                    return pb.id === parseInt(e.target.value)
                  })
                  setSelectedPreBuildCrystals(pb?.crystals || [])
                }}
                id="prebuild"
                sx={{ ...textFieldStyles, width: "100%" }}
              >
                <MenuItem key="None" value={[]}>
                  None
                </MenuItem>
                {preBuilds?.map((preBuild) => (
                  <MenuItem key={preBuild.id} value={preBuild.id}>
                    {preBuild.cycle ? (
                      <Typography>
                        {preBuild.subscription.shortName}: {preBuild.cycle}
                      </Typography>
                    ) : (
                      <Typography>
                        {preBuild.subscription.shortName}: {preBuild.cycleRangeStart} -{" "}
                        {preBuild.cycleRangeEnd}
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </TextField>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  overflow: "hidden",
                  marginTop: "24px",
                }}
              >
                {selectedPreBuildCrystals.map((c) => {
                  return (
                    <CrystalChip
                      crystal={c}
                      formik={formik}
                      selectedCrystalIds={formik.values.crystalIds}
                    />
                  )
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <FormControl fullWidth variant="outlined">
          <CrystalSelect formik={formik} />
        </FormControl>
        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end", marginTop: "48px" }}>
          <Button type="submit" variant="contained" color="primary">
            Create Shipment
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default NewShipment
