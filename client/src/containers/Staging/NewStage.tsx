import { useState } from "react"

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
import * as Yup from "yup"
import { monthOptions } from "../../lib/constants"
import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { usePreBuildStore } from "../../store/preBuildStore"
import CrystalSelect from "../../components/CrystalSelect"
import SmartSelect from "../../components/SmartSelect"
import { useSubscriptionStore } from "../../store/subscriptionStore"

const NewStage = ({ month, year, setMonth, setYear, fetchPreBuilds }) => {
  const { createPreBuild } = usePreBuildStore()
  const { subscriptions } = useSubscriptionStore()

  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleConfirmSubmit = () => {
    handleCloseModal()
    formik.handleSubmit()
  }

  const initialValues: {
    cycle: string
    crystalIds: number[]
    subscriptionId: number
  } = {
    cycle: "1",
    crystalIds: [],
    subscriptionId: subscriptions[0]?.id || 0,
  }

  const validationSchema = Yup.object({
    cycle: Yup.string().nullable().required("Cycle is required"),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
    groupLabel: Yup.string().nullable(),
  })

  const handleSubmit = async (formData: typeof initialValues) => {
    if (formData.crystalIds.length > 0) {
      await createPreBuild(formData)
      await formik.resetForm()
      fetchPreBuilds({})
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <form onSubmit={handleConfirmSubmit}>
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
            <Grid item xs={6}>
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
                >
                  {subscriptions.map((subscription) => (
                    <MenuItem key={subscription.id} value={subscription.id}>
                      {subscription.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={6} sx={{ position: "relative" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "white",
                  marginBottom: "4px",
                }}
              >
                Cycle (ex: 1, 4-5, 23, 56-76)
              </Typography>
              <TextField
                id="cycle"
                variant="outlined"
                fullWidth
                {...formik.getFieldProps("cycle")}
                inputProps={{ style: { color: "white" } }}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
          <Box sx={{ width: "100%", height: "1px", background: "lightgrey", margin: "48px 0" }} />
          {/* <Grid container>
            <Grid item xs={6}>
              <PreBuildAutocomplete preBuilds={preBuilds} formik={formik} />
            </Grid>
          </Grid> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "36px",
            }}
          >
            <TextField
              label="Month"
              select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              fullWidth
              sx={textFieldStyles}
            >
              {Object.keys(monthOptions).map((key) => (
                <MenuItem key={key} value={key}>
                  {monthOptions[key].long}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              fullWidth
              sx={textFieldStyles}
            />
          </Box>
          <FormControl fullWidth variant="outlined">
            <SmartSelect formik={formik} month={month} year={year} />
          </FormControl>

          <Box sx={{ width: "100%", height: "1px", background: "white", margin: "48px 0" }} />
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
              Stage Shipment
            </Button>
          </Box>
        </Box>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to stage this shipment?</DialogContentText>
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
    </Box>
  )
}

export default NewStage
