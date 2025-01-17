import { useEffect, useState } from "react"

import { useFormik } from "formik"
import {
  Box,
  TextField,
  Button,
  FormControl,
  Grid,
  Typography,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"

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
  resetDefaultGroupLabel: () => void
}

const NewShipment = ({ formik, allSubscriptions, resetDefaultGroupLabel }: NewShipmentT) => {
  const { preBuilds, fetchPreBuilds } = usePreBuildStore()
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    fetchPreBuilds({})
  }, [])

  const handleOpenModal = () => {
    setOpenModal(true) // Open the modal
  }

  const handleCloseModal = () => {
    setOpenModal(false) // Close the modal
  }

  const handleConfirmSubmit = () => {
    handleCloseModal()
    formik.handleSubmit() // Submit the form after confirmation
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          background: colors.slateA4,
          border: `1px solid ${colors.slateGrey}`,
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
              onBlur={resetDefaultGroupLabel}
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
              onBlur={resetDefaultGroupLabel}
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
                  color: "white",
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
              onBlur={resetDefaultGroupLabel}
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
                  color: "white",
                }}
              >
                Subscription Type
              </Typography>
              <TextField
                select
                id="subscriptionId"
                {...formik.getFieldProps("subscriptionId")}
                sx={textFieldStyles}
                onBlur={resetDefaultGroupLabel}
              >
                {allSubscriptions.map((subscription) => (
                  <MenuItem key={subscription.id} value={subscription.id}>
                    {subscription.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth variant="outlined">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Group Label
                </Typography>
              </Box>
              <TextField
                id="groupLabel"
                variant="outlined"
                fullWidth
                {...formik.getFieldProps("groupLabel")}
                inputProps={{ style: { color: "white" } }}
                sx={textFieldStyles}
              />
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
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            disabled={formik.values.crystalIds.length === 0}
          >
            Create Shipment
          </Button>
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to create this shipment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="primary"
            variant="outlined"
            sx={{ marginRight: "12px" }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default NewShipment
