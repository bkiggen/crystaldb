import { useEffect } from "react"

import { useFormik } from "formik"

import { Box, TextField, Chip, ListItemText, Autocomplete } from "@mui/material"

import { textFieldStyles } from "../styles/vars"
import { useCrystalStore } from "../store/crystalStore"

import type { CrystalT } from "../types/Crystal"

import ColorIndicator from "./ColorIndicator"
import colors from "../styles/colors"

type CrystalSelectT = {
  formik: ReturnType<typeof useFormik>
}

const CrystalSelect = ({ formik }: CrystalSelectT) => {
  const { fetchCrystals, crystals } = useCrystalStore()

  useEffect(() => {
    fetchCrystals({ noPaging: true })
  }, [])

  return (
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
      PaperComponent={({ children }) => {
        return <Box sx={{ background: colors.slate }}>{children}</Box>
      }}
      sx={{ background: "red" }}
      getOptionLabel={(option) => {
        const crystal = crystals.find((c) => c.id === option)
        return crystal ? crystal.name : ""
      }}
      onChange={(_, value) => {
        formik.setFieldValue("crystalIds", value)
      }}
      renderTags={(value: number[], getTagProps) => {
        return value.map((option: number, index: number) => {
          const crystal = crystals.find((c) => c.id === option)

          return (
            <Chip
              variant="outlined"
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ColorIndicator indicatorValue={crystal?.color?.hex} />
                  {crystal?.name}
                </Box>
              }
              {...getTagProps({ index })}
              sx={{ color: "white" }}
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
      renderOption={(props, option) => {
        const crystal: CrystalT = crystals.find((c) => c.id === option)
        return (
          <li {...props}>
            <ColorIndicator indicatorValue={crystal?.color?.hex} />
            <ListItemText primary={crystal?.name} sx={{ textTransform: "capitalize" }} />
          </li>
        )
      }}
      filterOptions={(options, params) => {
        const filtered = options.filter((option) => {
          const crystal = crystals.find((c) => c.id === option)
          if (!crystal) return
          return crystal.name.toLowerCase().includes(params.inputValue.toLowerCase())
        })

        return filtered
      }}
    />
  )
}

export default CrystalSelect
