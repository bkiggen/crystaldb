import { useEffect } from "react"

import { useFormik } from "formik"

import * as Yup from "yup"
import { Box, TextField, Button, FormControl, Grid, Typography, MenuItem } from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import { useSubscriptionStore } from "../../store/subscriptionStore"
import { usePreBuildStore } from "../../store/preBuildStore"

import CrystalSelect from "../../components/CrystalSelect"

const NewPreBuild = () => {
  const { createPreBuild } = usePreBuildStore()
  const { subscriptions } = useSubscriptionStore()

  const initialValues: {
    cycle: number
    crystalIds: number[]
    subscriptionId: number
  } = {
    cycle: 1,
    crystalIds: [],
    subscriptionId: subscriptions[0]?.id || 0,
  }

  useEffect(() => {
    formik.setFieldValue("subscriptionId", subscriptions[0]?.id)
  }, [subscriptions])

  const validationSchema = Yup.object({
    cycle: Yup.number().nullable().integer().min(1),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
  }).test(
    "cycle-or-cycleRange",
    "Either cycle or cycle range (start and end) must be provided",
    (values) => {
      const { cycle } = values
      const isCycleValid = cycle !== null

      return isCycleValid
    },
  )

  const handleSubmit = async (formData: typeof initialValues) => {
    createPreBuild(formData)
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
                Cycle
              </Typography>
            </Box>
            <TextField
              id="cycle"
              variant="outlined"
              fullWidth
              type="number"
              {...formik.getFieldProps("cycle")}
              inputProps={{ style: { color: "white" } }}
              sx={textFieldStyles}
            />
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
