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
import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { usePreBuildStore } from "../../store/preBuildStore"
import CrystalSelect from "../../components/CrystalSelect"
import SmartSelect from "../../components/SmartSelect"
import PreBuildAutocomplete from "./PreBuildAutocomplete"
import { useSubscriptionStore } from "../../store/subscriptionStore"

const NewShipment = () => {
  const { preBuilds, createPreBuild } = usePreBuildStore()
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
    console.log("🚀 ~ handleSubmit ~ formData:", formData)
    if (formData.crystalIds.length > 0) {
      //   createShipment({ ...formData, userCount: 0, userCountIsNew: false })
      // createPreBuild(formData)
      await formik.resetForm()
      //   resetSubType()
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
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
