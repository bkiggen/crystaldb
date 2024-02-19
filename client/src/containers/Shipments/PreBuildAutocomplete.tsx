import React, { useState } from "react"

import { Box, TextField, Autocomplete, Typography } from "@mui/material"
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

  return (
    <Box sx={{ width: "100%" }}>
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
          setSelectedPreBuildCrystals(newValue?.crystals || [])
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
