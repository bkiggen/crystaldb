import React, { useState, useEffect } from "react"

import { useFormik } from "formik"
import { Box, TextField, Button, FormControl, Grid, Typography, MenuItem } from "@mui/material"

import { monthOptions } from "../../lib/constants"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import type { SubscriptionT } from "../../types/Subscription"
import type { PreBuildT } from "../../types/PreBuild"

import { getAllPreBuilds } from "../../api/preBuilds"

import CrystalSelect from "../../components/CrystalSelect"
import SmartSelect from "../../components/SmartSelect"
import PreBuildAutocomplete from "./PreBuildAutocomplete"

type NewShipmentT = {
  allSubscriptions: SubscriptionT[]
  cycleRangeMode: boolean
  setCycleRangeMode: (arg: boolean) => void
  formik: ReturnType<typeof useFormik>
}

const NewShipment = ({
  formik,
  cycleRangeMode,
  setCycleRangeMode,
  allSubscriptions,
}: NewShipmentT) => {
  const [preBuilds, setPreBuilds] = useState<PreBuildT[] | null>(null)

  const fetchPreBuilds = async (args) => {
    const response = await getAllPreBuilds(args)
    setPreBuilds(response.data)
  }

  useEffect(() => {
    fetchPreBuilds({})
  }, [])

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
        <Box sx={{ width: "100%", height: "1px", background: "lightgrey", margin: "48px 0" }} />
        <Grid container>
          <Grid item xs={6}>
            <PreBuildAutocomplete
              preBuilds={preBuilds}
              formik={formik}
              setCycleRangeMode={setCycleRangeMode}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              {cycleRangeMode ? null : <SmartSelect formik={formik} />}
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{ width: "100%", height: "1px", background: "lightgrey", margin: "12px 0 48px 0" }}
        />
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
