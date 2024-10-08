import { useState } from "react"

import { Box, TextField, Autocomplete, Typography, Tooltip } from "@mui/material"
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
}

const PreBuildAutocomplete = ({ preBuilds, formik }: PreBuildAutocompleteT) => {
  const [selectedPreBuildCrystals, setSelectedPreBuildCrystals] = useState<CrystalT[]>([])
  const [tempFormValues, setTempFormValues] = useState<PreBuildT | null>()

  const setFormWithTempValues = () => {
    formik.setFieldValue("cycle", tempFormValues.cycle)
    formik.setFieldValue("subscriptionId", tempFormValues.subscription?.id)
    const existingCrystalIds = formik.values.crystalIds
    formik.setFieldValue(
      "crystalIds",
      Array.from(new Set([...existingCrystalIds, ...selectedPreBuildCrystals.map((c) => c.id)])),
    )
  }

  const removeSelectedCrystals = () => {
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
          getOptionLabel={(option) => (option.subscription?.shortName || "Box") + option.cycle}
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
              <Typography>
                {option.subscription?.shortName || "Box"}: {option.cycle}
              </Typography>
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="No PreBuilds found"
        />
        {selectedPreBuildCrystals.length ? (
          <Box>
            <Tooltip title="Add all">
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
                <Typography sx={{ fontSize: "24px", color: "white" }}>
                  <AddIcon />
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Remove all">
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
                <Typography sx={{ fontSize: "24px", color: "white" }}>
                  <RemoveIcon />
                </Typography>
              </Box>
            </Tooltip>
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
              withoutDelete
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default PreBuildAutocomplete
