import { useState, useEffect } from "react"
import ModalContainer from "../../components/Modals/ModalContainer"

import * as Yup from "yup"
import { useFormik } from "formik"

import {
  Box,
  TextField,
  Button,
  FormControl,
  Grid,
  ListItemText,
  Autocomplete,
  Typography,
  MenuItem,
  Popper,
} from "@mui/material"

import { textFieldStyles } from "../../styles/vars"

import { useCrystalStore } from "../../store/crystalStore"
import { usePreBuildStore } from "../../store/preBuildStore"
import { useSubscriptionStore } from "../../store/subscriptionStore"

import { PreBuildT } from "../../types/PreBuild"

import ConfirmDialogue from "../../components/ConfirmDialogue"
import SmartCheck from "./SmartCheck"
import CrystalChip from "../../components/SmartSelect/CrystalChip"

type UpdatePreBuildModalT = {
  preBuild: PreBuildT
  setSelectedPreBuild: (preBuild: PreBuildT[]) => void
}

const UpdatePreBuildModal = ({ preBuild, setSelectedPreBuild }: UpdatePreBuildModalT) => {
  const { crystals, fetchCrystals } = useCrystalStore()
  const {
    updatePreBuild,
    deletePreBuild,
    smartCheckPrebuild,
    smartCheck: { badCrystalIds, outInventoryCrystals },
    setPreBuildStore,
  } = usePreBuildStore()
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()
  const [smartChecked, setSmartChecked] = useState(false)

  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)

  useEffect(() => {
    fetchSubscriptions()

    return () => {
      setPreBuildStore({ smartCheck: { badCrystalIds: [], outInventoryCrystals: [] } })
    }
  }, [])

  const onDelete = async () => {
    await deletePreBuild(preBuild.id)

    setSelectedPreBuild([])
  }

  const initialValues: {
    cycle: string
    crystalIds: number[]
    subscriptionId: number
  } = {
    cycle: preBuild.cycle,
    crystalIds: preBuild.crystals.map((c) => c.id),
    subscriptionId: preBuild.subscription.id,
  }

  useEffect(() => {
    fetchCrystals({ noPaging: true })
  }, [])

  const validationSchema = Yup.object({
    cycle: Yup.string().required("Cycle is required"),
    subscriptionId: Yup.number().required("Subscription Type is required").integer(),
    crystalIds: Yup.array().of(Yup.number().integer()).required(),
  })

  const handleSubmit = async (formData: typeof initialValues) => {
    updatePreBuild({ ...formData, id: preBuild.id })
    setSelectedPreBuild([])
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    formik.setValues({
      cycle: preBuild.cycle,
      crystalIds: preBuild.crystals.map((c) => c.id),
      subscriptionId: preBuild.subscription.id,
    })
  }, [preBuild])

  useEffect(() => {
    setSmartChecked(false)
  }, [formik.values])

  const handleSmartCheck = (dateData) => {
    setSmartChecked(true)
    smartCheckPrebuild({ id: preBuild.id, ...dateData, ...formik.values })
  }

  const styleOptions = (isBadCrystal, isOutInventory) => {
    if (!smartChecked) {
      return {
        borderColor: "white",
        borderWidth: "1px",
      }
    } else if (isBadCrystal) {
      return {
        borderColor: "red",
        borderWidth: "2px",
      }
    } else if (isOutInventory) {
      return {
        borderColor: "orange",
        borderWidth: "2px",
      }
    } else {
      return {
        borderColor: "lightGreen",
        borderWidth: "2px",
      }
    }
  }

  return (
    <ModalContainer
      open
      onClose={() => setSelectedPreBuild([])}
      title="Update Pre-Build"
      paperStyles={{ minWidth: "600px" }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            padding: "24px",
            margin: "0 auto",
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
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ marginTop: "24px", display: "flex", alignItems: "center" }}
          >
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
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
                  renderTags={(value: number[]) => {
                    return value.map((crystalId: number, index: number) => {
                      const isBadCrystal = badCrystalIds.includes(crystalId)
                      const isOutInventory = outInventoryCrystals.includes(crystalId)
                      const crystal = crystals.find((c) => c.id === crystalId)
                      const styles = styleOptions(isBadCrystal, isOutInventory)

                      return (
                        <CrystalChip
                          key={`${index}-${crystalId}`}
                          crystal={crystal}
                          formik={formik}
                          handleRemoveCrystal={(_, crystalId) =>
                            formik.setFieldValue(
                              "crystalIds",
                              formik.values.crystalIds.filter((id) => id !== crystalId),
                            )
                          }
                          selectedCrystalIds={formik.values.crystalIds}
                          chipStyles={{
                            color: "white",
                            borderColor: styles.borderColor,
                            borderWidth: styles.borderWidth,
                            textTransform: "capitalize",
                          }}
                        />
                      )
                    })
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
                  // varies from other similar elements. Also, disablePortal is false here
                  PopperComponent={(popperProps) => (
                    <Popper {...popperProps} placement="top" style={{ zIndex: 1300 }} />
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

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "48px" }}>
            <Button variant="contained" color="error" onClick={() => setDeleteConfirmVisible(true)}>
              Delete
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update PreBuild
            </Button>
          </Box>
        </Box>
        <ConfirmDialogue
          open={deleteConfirmVisible}
          onClose={() => setDeleteConfirmVisible(false)}
          onConfirm={onDelete}
        />
      </form>
      <hr />
      <SmartCheck handleSubmit={handleSmartCheck} onClear={() => setSmartChecked(false)} />
    </ModalContainer>
  )
}

export default UpdatePreBuildModal
