import { useState, useEffect, useRef } from "react"

import dayjs from "dayjs"
import * as Yup from "yup"
import { useFormik } from "formik"

import {
  Box,
  TextField,
  Button,
  FormControl,
  Chip,
  Grid,
  ListItemText,
  Autocomplete,
  Typography,
  MenuItem,
} from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { monthOptions } from "../../lib/constants"

import { useCrystalStore } from "../../store/crystalStore"

import { useSubscriptionStore } from "../../store/subscriptionStore"
import { useShipmentStore } from "../../store/shipmentStore"

import { ShipmentT } from "../../types/Shipment"

import ModalContainer from "../../components/Modals/ModalContainer"
import ConfirmModal from "./ConfirmModal"

type UpdateShipmentModalT = {
  selectedShipment: ShipmentT
  setSelectedShipment: (shipment: ShipmentT) => void
}

const UpdateShipmentModal = ({ selectedShipment, setSelectedShipment }: UpdateShipmentModalT) => {
  const { crystals, fetchCrystals } = useCrystalStore()
  const { updateShipment, deleteShipments } = useShipmentStore()
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()

  const [confirmMode, setConfirmMode] = useState<"edit" | "delete" | null>(null)

  const updateButtonRef = useRef<HTMLButtonElement | null>(null)
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null)

  const currentYear = dayjs().year()
  const currentMonth = dayjs().month()

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    formik.setValues({
      month: selectedShipment.month,
      year: selectedShipment.year,
      cycle: selectedShipment.cycle,
      crystalIds: selectedShipment.crystals.map((c) => c.id),
      subscriptionId: selectedShipment.subscription.id || 1,
      userCount: selectedShipment.userCount,
      groupLabel: selectedShipment.groupLabel,
    })
  }, [selectedShipment])

  const initialValues: {
    month: number
    year: number
    cycle: number
    crystalIds: number[]
    subscriptionId: number
    userCount: number
    groupLabel: string | number
  } = {
    month: currentMonth,
    year: currentYear,
    cycle: selectedShipment.cycle,
    crystalIds: selectedShipment.crystals.map((c) => c.id),
    subscriptionId: selectedShipment.subscription.id || 1,
    userCount: selectedShipment.userCount || 0,
    groupLabel: selectedShipment.groupLabel || "",
  }

  useEffect(() => {
    fetchCrystals({ noPaging: true })
  }, [])

  const validationSchema = Yup.object({
    month: Yup.number().required("Month is required").integer().min(0).max(11),
    year: Yup.number()
      .required("Year is required")
      .integer()
      .min(2016)
      .max(currentYear + 1),
    cycle: Yup.number().nullable().integer().min(1).required("Cycle is required"),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
    userCount: Yup.number().integer(),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
    groupLabel: Yup.string(),
  })

  const getUpdatedFields = (currentValues: any, initialValues: any) => {
    return Object.keys(currentValues).reduce((updatedFields, key) => {
      if (currentValues[key] !== initialValues[key]) {
        updatedFields[key] = currentValues[key]
      }
      return updatedFields
    }, {})
  }

  const handleUpdateOrDelete = async ({ isBulkEdit }: { isBulkEdit: boolean }) => {
    if (confirmMode === "edit") {
      // Extract only updated fields
      const updatedFields = getUpdatedFields(formik.values, formik.initialValues)

      if (Object.keys(updatedFields).length === 0) {
        // No updates, avoid unnecessary API calls
        setConfirmMode(null)
        return
      }

      await updateShipment({
        ...updatedFields,
        id: selectedShipment.id,
        isBulkEdit,
      })
    } else {
      await deleteShipments({ shipmentIdArr: [selectedShipment.id], isBulkDelete: isBulkEdit })
    }

    setSelectedShipment(null)
    formik.resetForm()
  }

  const handleSubmit = () => {
    setConfirmMode("edit")
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <ModalContainer
      open
      onClose={() => setSelectedShipment(null)}
      title="Update shipment"
      paperStyles={{ maxWidth: "600px", width: "100%" }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            background: colors.slateA4,
            padding: "24px",
            paddingTop: "48px",
            margin: "0 auto",
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
                error={formik.touched.month && Boolean(formik.errors.month)}
                helperText={<>{formik.touched.month ? formik.errors.month : ""}</>}
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
              <Typography
                sx={{ color: "white", fontSize: "14px", position: "absolute", top: "-8px" }}
              >
                User Count
              </Typography>
              <TextField
                id="userCount"
                variant="outlined"
                fullWidth
                type="number"
                {...formik.getFieldProps("userCount")}
                sx={textFieldStyles}
                error={formik.touched.userCount && Boolean(formik.errors.userCount)}
                helperText={<>{formik.touched.userCount ? formik.errors.userCount : ""}</>}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "12px" }}>
            <Grid item xs={6} sx={{ position: "relative", marginTop: "25px" }}>
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
                  Cycle
                </Typography>
              </Box>
              <TextField
                id="month"
                variant="outlined"
                fullWidth
                type="number"
                {...formik.getFieldProps("cycle")}
                inputProps={{ style: { color: "white" } }}
                sx={textFieldStyles}
                error={formik.touched.cycle && Boolean(formik.errors.cycle)}
                helperText={<>{formik.touched.cycle ? formik.errors.cycle : ""}</>}
              />
            </Grid>
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
                  error={formik.touched.subscriptionId && Boolean(formik.errors.subscriptionId)}
                  helperText={
                    <>{formik.touched.subscriptionId ? formik.errors.subscriptionId : ""}</>
                  }
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
          <Grid item xs={12} sx={{ position: "relative", marginTop: "24px" }}>
            <Typography
              sx={{
                fontSize: "14px",
                marginBottom: "4px",
                color: "white",
              }}
            >
              Group Label
            </Typography>
            <TextField
              id="groupLabel"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("groupLabel")}
              inputProps={{ style: { color: "white" } }}
              sx={textFieldStyles}
              error={formik.touched.groupLabel && Boolean(formik.errors.groupLabel)}
              helperText={<>{formik.touched.groupLabel ? formik.errors.groupLabel : ""}</>}
            />
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ marginTop: "24px", display: "flex", alignItems: "center" }}
          >
            <Grid item xs={12} sx={{ marginTop: "12px", marginBottom: "24px" }}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  disablePortal
                  id="crystal-select"
                  disableCloseOnSelect
                  multiple
                  defaultValue={formik.values.crystalIds}
                  value={formik.values.crystalIds}
                  options={crystals?.map((c) => {
                    return c.id
                  })}
                  getOptionLabel={(option) => {
                    const crystal = crystals.find((c) => c.id === option)
                    return crystal ? crystal.name : ""
                  }}
                  onChange={(_, value) => {
                    formik.setFieldValue("crystalIds", value)
                  }}
                  renderTags={(value: number[], getTagProps) => {
                    return value.map((option: number, index: number) => (
                      <Chip
                        variant="outlined"
                        label={crystals.find((c) => c.id === option)?.name}
                        {...getTagProps({ index })}
                        sx={{ color: "white", textTransform: "capitalize" }}
                      />
                    ))
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Crystals"
                        placeholder="Search"
                        sx={textFieldStyles}
                      />
                    )
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <ListItemText primary={crystals.find((c) => c.id === option)?.name} />
                    </li>
                  )}
                  filterOptions={(options, params) => {
                    const filtered = options.filter((option) => {
                      const crystal = crystals.find((c) => c.id === option)
                      if (!crystal) return
                      return crystal.name.toLowerCase().includes(params.inputValue.toLowerCase())
                    })

                    return filtered
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmMode("delete")}
              ref={deleteButtonRef}
            >
              Delete
            </Button>
            <Button type="submit" variant="contained" color="primary" ref={updateButtonRef}>
              Update
            </Button>
            <ConfirmModal
              open={confirmMode}
              onClose={() => {
                setConfirmMode(null)
              }}
              onConfirm={handleUpdateOrDelete}
              buttonRef={confirmMode === "edit" ? updateButtonRef : deleteButtonRef}
              isEditMode={confirmMode === "edit"}
            />
          </Box>
        </Box>
      </form>
    </ModalContainer>
  )
}

export default UpdateShipmentModal
