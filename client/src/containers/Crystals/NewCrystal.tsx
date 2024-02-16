import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import colors from "../../styles/colors"

import * as Yup from "yup"
import { Box, TextField, Button, MenuItem, FormControl, InputLabel, Grid } from "@mui/material"

import { textFieldStyles } from "../../styles/vars"

import type { CrystalT, RarityT, FindAgeT, SizeT, InventoryT } from "../../types/Crystal"
import type { ColorT } from "../../types/Color"

import { createCrystal } from "../../api/crystals"
import { getAllColors } from "../../api/colors"

import NewColorModal from "./NewColorModal"
import ColorIndicator from "../../components/ColorIndicator"

type NewCrystalT = {
  addCrystal: (arg: CrystalT) => void
}
const NewCrystal = ({ addCrystal }: NewCrystalT) => {
  const [colorOptions, setColorOptions] = useState<ColorT[]>([])
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false)

  const enums = {
    rarity: ["LOW", "MEDIUM", "HIGH"],
    findAge: ["NEW", "OLD", "DEAD"],
    size: ["XS", "S", "M", "L", "XL"],
    inventory: ["HIGH", "MEDIUM", "LOW", "OUT"],
  }

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
    rarity: Yup.string().oneOf(enums.rarity as RarityT[], "Invalid rarity value"),
    description: Yup.string(),
    image: Yup.string(),
    findAge: Yup.string().oneOf(enums.findAge as FindAgeT[], "Invalid Find Age value"),
    size: Yup.string().oneOf(enums.size as SizeT[], "Invalid Size value"),
    inventory: Yup.string().oneOf(enums.inventory as InventoryT[], "Invalid Inventory value"),
  })

  const handleSubmit = async (formData: typeof initialValues) => {
    console.log("form data", formData)
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
  console.log("formik", formik.errors)

  const fetchColors = async () => {
    const colorResponse = await getAllColors()
    setColorOptions(colorResponse)
  }

  useEffect(() => {
    fetchColors()
  }, [])

  const indicatorOptions = (indicatorType: keyof typeof enums) => {
    return enums[indicatorType].map((value) => (
      <MenuItem key={value} value={value}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ColorIndicator indicatorType={indicatorType} indicatorValue={value} />
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
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="color" sx={{ color: "white" }}>
                  Color
                </InputLabel>
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
                {...formik.getFieldProps("category")}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "0px" }}>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <InputLabel htmlFor="rarity" sx={{ color: "white" }}>
                  Rarity
                </InputLabel>
                <TextField
                  select
                  label="Rarity"
                  id="rarity"
                  {...formik.getFieldProps("rarity")}
                  sx={textFieldStyles}
                >
                  {indicatorOptions("rarity")}
                </TextField>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <InputLabel htmlFor="rarity" sx={{ color: "white" }}>
                  Find Age
                </InputLabel>
                <TextField
                  select
                  label="Find Age"
                  id="findAge"
                  {...formik.getFieldProps("findAge")}
                  sx={textFieldStyles}
                >
                  {indicatorOptions("findAge")}
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
                <InputLabel htmlFor="rarity" sx={{ color: "white" }}>
                  Size
                </InputLabel>
                <TextField
                  select
                  label="Size"
                  id="size"
                  {...formik.getFieldProps("size")}
                  sx={textFieldStyles}
                >
                  {enums["size"].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <InputLabel htmlFor="rarity" sx={{ color: "white" }}>
                  Inventory
                </InputLabel>
                <TextField
                  select
                  label="Inventory"
                  id="inventory"
                  {...formik.getFieldProps("inventory")}
                  sx={textFieldStyles}
                >
                  {enums["inventory"].map((value) => (
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
