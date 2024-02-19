import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import colors from "../../styles/colors"

import * as Yup from "yup"
import { Box, TextField, Button, MenuItem, FormControl, Grid } from "@mui/material"

import { textFieldStyles } from "../../styles/vars"

import {
  rarityOptions,
  findAgeOptions,
  sizeOptions,
  inventoryOptions,
  categoryOptions,
} from "../../types/Crystal"
import type { ColorT } from "../../types/Color"
import type { CrystalT, RarityT, FindAgeT, SizeT, InventoryT } from "../../types/Crystal"

import useDebounce from "../../hooks/useDebounce"

import { createCrystal } from "../../api/crystals"
import { getAllColors } from "../../api/colors"
import { getAllCrystals } from "../../api/crystals"

import NewColorModal from "./NewColorModal"
import ColorIndicator from "../../components/ColorIndicator"

type NewCrystalT = {
  addCrystal: (arg: CrystalT) => void
}

const NewCrystal = ({ addCrystal }: NewCrystalT) => {
  const [colorOptions, setColorOptions] = useState<ColorT[]>([])
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false)
  const [crystals, setCrystals] = useState<CrystalT[]>([])
  const [crystalsVisible, setCrystalsVisible] = useState(false)
  const [rawSearch, setRawSearch] = useState(null)
  const debouncedSearch = useDebounce(rawSearch, 300)

  const initialValues: {
    name: string
    colorId?: number
    category?: string
    rarity?: RarityT
    description?: string
    image?: string
    findAge?: FindAgeT
    size?: SizeT
    inventory?: InventoryT
  } = {
    name: "",
    colorId: undefined,
    category: "",
    rarity: undefined,
    description: "",
    image: "",
    findAge: undefined,
    size: "M",
    inventory: "HIGH",
  }

  const validationSchema: Yup.Schema<typeof initialValues> = Yup.object({
    name: Yup.string().required("Name is required"),
    colorId: Yup.number().integer(),
    category: Yup.string(),
    rarity: Yup.string().oneOf(rarityOptions as RarityT[], "Invalid rarity value"),
    description: Yup.string(),
    image: Yup.string(),
    findAge: Yup.string().oneOf(findAgeOptions as FindAgeT[], "Invalid Find Age value"),
    size: Yup.string().oneOf(sizeOptions as SizeT[], "Invalid Size value"),
    inventory: Yup.string().oneOf(inventoryOptions as InventoryT[], "Invalid Inventory value"),
  })

  const handleSubmit = async (formData: typeof initialValues) => {
    const newCrystal = await createCrystal({
      name: formData.name,
      colorId: formData.colorId,
      category: formData.category,
      rarity: formData.rarity,
      description: formData.description,
      image: formData.image,
      findAge: formData.findAge,
      size: formData.size,
      inventory: formData.inventory,
    })
    addCrystal(newCrystal)
    formik.resetForm()
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const fetchColors = async () => {
    const colorResponse = await getAllColors()
    setColorOptions(colorResponse)
  }

  const getCrystals = async ({ searchTerm = "" }) => {
    const response = await getAllCrystals({ searchTerm, noPaging: true })
    setCrystals(response.data || [])
    setCrystalsVisible(true)
  }

  useEffect(() => {
    if (formik.values.name && formik.values.name.length > 2) {
      setRawSearch(formik.values.name)
    } else if (formik.values.name.length === 0) {
      setCrystalsVisible(false)
    }
  }, [formik.values.name])

  useEffect(() => {
    if (debouncedSearch) {
      getCrystals({ searchTerm: debouncedSearch })
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchColors()
  }, [])

  const indicatorOptions = (indicatorName, indicatorValues) => {
    return indicatorValues.map((value) => (
      <MenuItem key={value} value={value}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ColorIndicator indicatorType={indicatorName} indicatorValue={value} />
          {value}
        </Box>
      </MenuItem>
    ))
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            background: colors.slateA4,
            border: "1px solid #fff",
            padding: "24px",
            paddingTop: "48px",
            margin: "0 auto",
            marginBottom: "48px",
            borderRadius: "4px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                {...formik.getFieldProps("name")}
                sx={textFieldStyles}
                onBlur={() => setCrystalsVisible(false)}
              />
              {crystalsVisible && crystals.length > 0 ? (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 123,
                    background: colors.slate,
                    padding: "12px 24px",
                  }}
                >
                  {crystals.map((crystal) => {
                    return (
                      <Box key={crystal.id} sx={{ margin: "6px 0" }}>
                        {crystal.name}
                      </Box>
                    )
                  })}
                </Box>
              ) : null}
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  select
                  label="Color"
                  id="colorId"
                  {...formik.getFieldProps("colorId")}
                  sx={textFieldStyles}
                >
                  <MenuItem>
                    <Button onClick={() => setColorModalOpen(true)} sx={{ width: "100%" }}>
                      Add New...
                    </Button>
                  </MenuItem>
                  {colorOptions.map((colorOption) => {
                    return (
                      <MenuItem key={colorOption.id} value={colorOption.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            textTransform: "capitalize",
                          }}
                        >
                          <Box
                            sx={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: colorOption.hex,
                              marginRight: "8px",
                            }}
                          />
                          {colorOption.name}
                        </Box>
                      </MenuItem>
                    )
                  })}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="category"
                label="Category"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("category")}
                sx={textFieldStyles}
              >
                {categoryOptions.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "0px" }}>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <TextField
                  select
                  label="Rarity"
                  id="rarity"
                  {...formik.getFieldProps("rarity")}
                  sx={textFieldStyles}
                >
                  {indicatorOptions("rarity", rarityOptions)}
                </TextField>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <TextField
                  select
                  label="Find Age"
                  id="findAge"
                  {...formik.getFieldProps("findAge")}
                  sx={textFieldStyles}
                >
                  {indicatorOptions("findAge", findAgeOptions)}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                {...formik.getFieldProps("description")}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "-12px" }}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <TextField
                  select
                  label="Size"
                  id="size"
                  {...formik.getFieldProps("size")}
                  sx={textFieldStyles}
                >
                  {sizeOptions.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <TextField
                  select
                  label="Inventory"
                  id="inventory"
                  {...formik.getFieldProps("inventory")}
                  sx={textFieldStyles}
                >
                  {inventoryOptions.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
          <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" color="primary">
              Create Crystal
            </Button>
          </Box>
        </Box>
      </form>
      {colorModalOpen && (
        <NewColorModal
          onClose={() => {
            setColorModalOpen(false)
            setTimeout(() => {
              fetchColors()
            }, 1000)
          }}
        />
      )}
    </>
  )
}

export default NewCrystal