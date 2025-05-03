import dayjs from "dayjs"
import * as Yup from "yup"
import { useFormik } from "formik"

import { Box, TextField, Button, Grid, Typography, MenuItem } from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { monthOptions } from "../../lib/constants"
import { usePreBuildStore } from "../../store/preBuildStore"

const MonthYearForm = ({ handleSubmit, onClear, smartCheckLoading }) => {
  const currentYear = dayjs().year()
  const currentMonth = dayjs().month()

  const { setPreBuildStore } = usePreBuildStore()

  const initialValues = {
    month: currentMonth,
    year: currentYear,
  }

  const validationSchema = Yup.object({
    month: Yup.number()
      .required("Month is required")
      .integer()
      .min(0, "Month cannot be less than 0")
      .max(11, "Month cannot be greater than 11"),
    year: Yup.number()
      .required("Year is required")
      .integer()
      .min(2000, "Year must be at least 2000")
      .max(currentYear + 1, `Year cannot be greater than ${currentYear + 1}`),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const clearSmartCheck = () => {
    onClear()
    setPreBuildStore({
      smartCheck: {
        badCrystalIds: [],
        outInventoryCrystals: [],
      },
    })
  }

  return (
    <Box
      sx={{
        background: colors.slateA4,
        padding: "24px",
        paddingTop: "48px",
        margin: "0 auto",
        maxWidth: "600px",
        borderRadius: "4px",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* Month Field */}
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
              error={formik.touched.month && Boolean(formik.errors.month)}
              helperText={formik.touched.month ? (formik.errors.month as string) : ""}
            >
              {Object.keys(monthOptions).map((monthNumber) => (
                <MenuItem key={monthNumber} value={parseInt(monthNumber, 10)}>
                  {monthOptions[monthNumber]?.long}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Year Field */}
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
              error={formik.touched.year && Boolean(formik.errors.year)}
              helperText={formik.touched.year ? (formik.errors.year as string) : ""}
            />
          </Grid>
        </Grid>

        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <Button type="button" variant="outlined" onClick={clearSmartCheck}>
            Clear
          </Button>
          <Button type="submit" variant="contained" color="secondary" disabled={smartCheckLoading}>
            Smart Check
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default MonthYearForm
