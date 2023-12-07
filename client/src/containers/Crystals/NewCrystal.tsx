import React, { useEffect, useState } from "react"
import { useFormik } from "formik"

import * as Yup from "yup"
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material"

import { textFieldStyles } from "../../styles/vars"

import type { CrystalT, RarityT, FindAgeT } from "../../types/Crystal"
import type { ColorT } from "../../types/Color"

import { createCrystal } from "../../graphql/crystals"
import { getAllColors } from "../../graphql/colors"

import NewColorModal from "./NewColorModal"

type NewCrystalT = {
  addCrystal: (arg: CrystalT) => void
}
const NewCrystal = ({ addCrystal }: NewCrystalT) => {
  const [colors, setColors] = useState<ColorT[]>([])
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false)

  const enums = {
    rarity: ["LOW", "MEDIUM", "HIGH"],
    findAge: ["NEW", "OLD", "DEAD"],
  }

  const initialValues: {
    name: string
    colorId?: number
    category?: string
    rarity?: RarityT
    description?: string
    image?: string
    findAge?: FindAgeT
  } = {
    name: "",
    colorId: undefined,
    category: "",
    rarity: undefined,
    description: "",
    image: "",
    findAge: undefined,
  }

  const validationSchema: Yup.Schema<typeof initialValues> = Yup.object({
    name: Yup.string().required("Name is required"),
    colorId: Yup.number().integer(),
    category: Yup.string(),
    rarity: Yup.string().oneOf(enums.rarity as RarityT[], "Invalid rarity value"),
    description: Yup.string(),
    image: Yup.string(),
    findAge: Yup.string().oneOf(enums.findAge as FindAgeT[], "Invalid Find Age value"),
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
    setColors(colorResponse)
  }

  useEffect(() => {
    fetchColors()
  }, [])

  const indicatorOptions = (enumCategory: keyof typeof enums) => {
    const colors = ["green", "yellow", "red"]

    return enums[enumCategory].map((value, index) => (
      <MenuItem key={value} value={value}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: colors[index],
              marginRight: "8px",
            }}
          />
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
            background: "rgba(70, 90, 126, 0.4)",
            border: "1px solid #fff",
            padding: "24px",
            paddingTop: "48px",
            margin: "0 auto",
            marginBottom: "48px",
            borderRadius: "4px",
            maxWidth: "1200px",
            width: "90%",
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
                <Select
                  label="Color"
                  id="color"
                  {...formik.getFieldProps("color")}
                  sx={{
                    "& .MuiSelect-select": {
                      border: "1px solid #fff",
                      borderRadius: "4px",
                      color: "white",
                    },
                  }}
                >
                  <MenuItem>
                    <Button onClick={() => setColorModalOpen(true)} sx={{ width: "100%" }}>
                      Add New...
                    </Button>
                  </MenuItem>
                  {colors.map((color) => {
                    return (
                      <MenuItem key={color.id} value={color.id}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: color.hex,
                              marginRight: "8px",
                            }}
                          />
                          {color.name}
                        </Box>
                      </MenuItem>
                    )
                  })}
                </Select>
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
                <Select
                  label="Rarity"
                  id="rarity"
                  {...formik.getFieldProps("rarity")}
                  sx={{
                    "& .MuiSelect-select": {
                      border: "1px solid #fff",
                      borderRadius: "4px",
                      color: "white",
                    },
                  }}
                >
                  {indicatorOptions("rarity")}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: "12px" }}>
                <InputLabel htmlFor="rarity" sx={{ color: "white" }}>
                  Find Age
                </InputLabel>
                <Select
                  label="Find Age"
                  id="findAge"
                  {...formik.getFieldProps("findAge")}
                  sx={{
                    "& .MuiSelect-select": {
                      border: "1px solid #fff",
                      borderRadius: "4px",
                      color: "white",
                    },
                  }}
                >
                  {indicatorOptions("findAge")}
                </Select>
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

          <Box mt={2}>
            <TextField
              id="image"
              label="Image URL"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("image")}
              sx={textFieldStyles}
            />
          </Box>
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
