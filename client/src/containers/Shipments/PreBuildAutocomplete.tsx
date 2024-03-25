import React, { useState } from "react"

import { Box, TextField, Autocomplete, Typography } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { useFormik } from "formik"

import { textFieldStyles } from "../../styles/vars"

import type { CrystalT } from "../../types/Crystal"
import type { PreBuildT } from "../../types/PreBuild"

import CrystalChip from "../../components/SmartSelect/CrystalChip"

type PreBuildAutocompleteT = {
  preBuilds: PreBuildT[]
  formik: ReturnType<typeof useFormik>
  setCycleRangeMode: (arg: boolean) => void
}

const PreBuildAutocomplete = ({ preBuilds, formik, setCycleRangeMode }: PreBuildAutocompleteT) => {
  const [selectedPreBuildCrystals, setSelectedPreBuildCrystals] = useState<CrystalT[]>([])
  const [tempFormValues, setTempFormValues] = useState<PreBuildT | null>()

  const setFormWithTempValues = () => {
    setCycleRangeMode(!tempFormValues.cycle)
    formik.setFieldValue("cycle", tempFormValues.cycle)
    formik.setFieldValue("cycleRangeStart", tempFormValues.cycleRangeStart)
    formik.setFieldValue("cycleRangeEnd", tempFormValues.cycleRangeEnd)
    formik.setFieldValue("subscriptionId", tempFormValues.subscription.id)
    formik.setFieldValue(
      "crystalIds",
      tempFormValues.crystals.map((c) => c.id),
    )
  }

  const removeSelectedCrystals = () => {
    setSelectedPreBuildCrystals([])
    setTempFormValues(null)
    formik.setFieldValue(
      "crystalIds",
      formik.values.crystalIds.filter(
        (id) => !selectedPreBuildCrystals.map((c) => c.id).includes(id),
      ),
    )
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ position: "relative" }}>
        <Autocomplete
          id="prebuild-autocomplete"
          options={preBuilds}
          getOptionLabel={(option) =>
            option.subscription.shortName +
            (option.cycle
              ? `: ${option.cycle}`
              : `: ${option.cycleRangeStart} - ${option.cycleRangeEnd}`)
          }
          onChange={(_, newValue) => {
            if (!newValue) {
              setSelectedPreBuildCrystals([])
              setTempFormValues(null)
            } else {
              setSelectedPreBuildCrystals(newValue?.crystals || [])
              setTempFormValues(newValue)
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="PreBuild"
              placeholder="Type to search..."
              variant="outlined"
              sx={{ ...textFieldStyles, width: "100%" }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              {option.cycle ? (
                <Typography>
                  {option.subscription.shortName}: {option.cycle}
                </Typography>
              ) : (
                <Typography>
                  {option.subscription.shortName}: {option.cycleRangeStart} - {option.cycleRangeEnd}
                </Typography>
              )}
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="No PreBuilds found"
        />
        {selectedPreBuildCrystals.length ? (
          <Box>
            <Box
              sx={{
                height: "24px",
                width: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: "0",
                marginTop: "8px",
                cursor: "pointer",
              }}
              onClick={setFormWithTempValues}
            >
              <Typography sx={{ fontSize: "24px", color: "skyblue" }}>
                <AddIcon />
              </Typography>
            </Box>
            <Box
              sx={{
                height: "24px",
                width: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: "28px",
                marginTop: "8px",
                cursor: "pointer",
              }}
              onClick={removeSelectedCrystals}
            >
              <Typography sx={{ fontSize: "24px", color: "skyblue" }}>
                <RemoveIcon />
              </Typography>
            </Box>
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          overflow: "hidden",
          marginTop: "24px",
        }}
      >
        {selectedPreBuildCrystals.map((c) => {
          return (
            <CrystalChip
              crystal={c}
              formik={formik}
              selectedCrystalIds={formik.values.crystalIds}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default PreBuildAutocomplete
