import { useEffect } from "react"

import { useFormik } from "formik"
import dayjs from "dayjs"

import * as Yup from "yup"
import { Box, TextField, FormControl, Grid, MenuItem } from "@mui/material"

import { useSubscriptionStore } from "../../store/subscriptionStore"

import { monthOptions } from "../../lib/constants"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

const DateChanger = ({ fetchShipments }) => {
  const currentYear = dayjs().year()
  const currentMonth = dayjs().month()

  const { fetchSubscriptions, subscriptions } = useSubscriptionStore()

  const resetSubType = () => {
    formik.setFieldValue("subscriptionId", 0)
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    if (subscriptions.length > 0) {
      resetSubType()
    }
  }, [subscriptions])

  const initialValues: {
    month: number
    year: number
    subscriptionId: number
  } = {
    month: currentMonth,
    year: currentYear,
    subscriptionId: subscriptions[0]?.id || 0,
  }

  const validationSchema = Yup.object({
    month: Yup.number().required("Month is required").integer().min(0).max(11),
    year: Yup.number()
      .required("Year is required")
      .integer()
      .min(2016)
      .max(currentYear + 1),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => null,
  })

  useEffect(() => {
    if (subscriptions.length > 0) {
      fetchShipments({
        month: formik.values.month,
        year: formik.values.year,
        subscriptionId: formik.values.subscriptionId === 0 ? null : formik.values.subscriptionId,
        pageSize: 2000,
      })
    }
  }, [formik.values.month, formik.values.year, formik.values.subscriptionId, subscriptions])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          background: colors.slateA4,
          border: "1px solid #fff",
          padding: "12px",
          margin: "0 auto",
          marginBottom: "48px",
          borderRadius: "4px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ position: "relative" }}>
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
            <FormControl fullWidth variant="outlined">
              <TextField
                select
                id="subscriptionId"
                {...formik.getFieldProps("subscriptionId")}
                sx={textFieldStyles}
              >
                <MenuItem key="All" value={0}>
                  All
                </MenuItem>
                {subscriptions.map((subscription) => {
                  return (
                    <MenuItem key={subscription.id} value={subscription.id}>
                      {subscription.name}
                    </MenuItem>
                  )
                })}
              </TextField>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </form>
  )
}

export default DateChanger
