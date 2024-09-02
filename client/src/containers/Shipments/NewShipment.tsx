import { useEffect } from "react"

import { useFormik } from "formik"
import { Box, TextField, Button, FormControl, Grid, Typography, MenuItem } from "@mui/material"

import { monthOptions } from "../../lib/constants"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import type { SubscriptionT } from "../../types/Subscription"

import { usePreBuildStore } from "../../store/preBuildStore"

import CrystalSelect from "../../components/CrystalSelect"
import SmartSelect from "../../components/SmartSelect"
import PreBuildAutocomplete from "./PreBuildAutocomplete"

type NewShipmentT = {
  allSubscriptions: SubscriptionT[]
  formik: ReturnType<typeof useFormik>
}

const NewShipment = ({ formik, allSubscriptions }: NewShipmentT) => {
  const { preBuilds, fetchPreBuilds } = usePreBuildStore()

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
              error={formik.touched.year && Boolean(formik.errors.year)}
              helperText={<>{formik.touched.year ? formik.errors.year : ""}</>}
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
                Cycle (ex: 1, 4-5, 23, 56-76)
              </Typography>
            </Box>

            <TextField
              id="cycleString"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("cycleString")}
              inputProps={{ style: { color: "white" } }}
              sx={textFieldStyles}
            />
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
            <PreBuildAutocomplete preBuilds={preBuilds} formik={formik} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <SmartSelect formik={formik} />
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ width: "100%", height: "1px", background: "white", margin: "12px 0 48px 0" }} />
        <FormControl fullWidth variant="outlined">
          <CrystalSelect formik={formik} />
        </FormControl>
        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end", marginTop: "48px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.values.crystalIds.length === 0}
          >
            Create Shipment
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default NewShipment
