import { useEffect, useState } from "react"
import { useFormik } from "formik"
import systemColors from "../../styles/colors"

import * as Yup from "yup"
import { Box, TextField, Button, MenuItem, FormControl, Grid } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"

import { textFieldStyles } from "../../styles/vars"

import { rarityOptions, findAgeOptions, sizeOptions, inventoryOptions } from "../../types/Crystal"
import type { ColorT } from "../../types/Color"
import type { CategoryT } from "../../types/Category"
import type { LocationT } from "../../types/Location"
import type { RarityT, FindAgeT, SizeT, InventoryT } from "../../types/Crystal"

import { useCrystalStore } from "../../store/crystalStore"
import { useCategoryStore } from "../../store/categoryStore"
import { useLocationStore } from "../../store/locationStore"

import useDebounce from "../../hooks/useDebounce"
import capitalizeFirstLetter from "../../util/capitalizeFirstLetter"

import { useColorStore } from "../../store/colorStore"

import NewColorModal from "./NewColorModal"
import NewLocationModal from "./NewLocationModal"
import NewCategoryModal from "./NewCategoryModal"

const NewCrystal = () => {
  const { colors, fetchColors } = useColorStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { locations, fetchLocations } = useLocationStore()
  const { createCrystal, crystalMatches, fetchCrystalMatches } = useCrystalStore()
  const [colorToEdit, setColorToEdit] = useState<ColorT[]>(null)
  const [colorModalOpen, setColorModalOpen] = useState(false)
  const [locationToEdit, setLocationToEdit] = useState<LocationT[]>(null)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryT[]>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const [crystalsVisible, setCrystalsVisible] = useState(false)
  const [rawSearch, setRawSearch] = useState(null)
  const debouncedSearch = useDebounce(rawSearch, 300)

  useEffect(() => {
    fetchColors()
    fetchCategories()
    fetchLocations()
  }, [])

  const initialValues: {
    name?: string
    colorId?: number
    categoryId?: number
    locationId?: number
    rarity?: RarityT
    description?: string
    image?: string
    findAge?: FindAgeT
    size?: SizeT
    inventory?: InventoryT
  } = {
    name: "",
    colorId: undefined,
    categoryId: undefined,
    locationId: undefined,
    rarity: undefined,
    description: "",
    image: "",
    findAge: undefined,
    size: "M",
    inventory: "MEDIUM",
  }

  const validationSchema: Yup.Schema<typeof initialValues> = Yup.object({
    name: Yup.string().required("Name is required"),
    colorId: Yup.number().integer().required("Color is required"),
    categoryId: Yup.number().required("Category is required"),
    locationId: Yup.number().required("Location is required"),
    rarity: Yup.string().oneOf(rarityOptions as RarityT[], "Invalid rarity value"),
    description: Yup.string(),
    image: Yup.string(),
    findAge: Yup.string().oneOf(findAgeOptions as FindAgeT[], "Invalid Find Age value"),
    size: Yup.string().oneOf(sizeOptions as SizeT[], "Invalid Size value"),
    inventory: Yup.string().oneOf(inventoryOptions as InventoryT[], "Invalid Inventory value"),
  })

  const handleSubmit = async (formData: typeof initialValues) => {
    createCrystal({
      name: capitalizeFirstLetter(formData.name),
      colorId: formData.colorId,
      categoryId: formData.categoryId || undefined,
      rarity: formData.rarity,
      description: formData.description,
      image: formData.image,
      findAge: formData.findAge,
      size: formData.size,
      inventory: formData.inventory,
      locationId: formData.locationId || undefined,
    })
    formik.resetForm()
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  const getCrystals = async ({ searchTerm = "" }) => {
    fetchCrystalMatches({ searchTerm, noPaging: true })
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

  const handleColorEdit = (e, colorToEdit) => {
    e.stopPropagation()
    setColorToEdit(colorToEdit)
    setColorModalOpen(true)
  }

  const handleCategoryEdit = (e, categoryToEdit) => {
    e.stopPropagation()
    setCategoryToEdit(categoryToEdit)
    setCategoryModalOpen(true)
  }

  const handleLocationEdit = (e, locationToEdit) => {
    e.stopPropagation()
    setLocationToEdit(locationToEdit)
    setLocationModalOpen(true)
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            background: systemColors.slateA4,
            border: `1px solid ${systemColors.slateGrey}`,
            padding: "24px",
            paddingTop: "48px",
            margin: "0 auto",
            marginBottom: "48px",
            borderRadius: "4px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                {...formik.getFieldProps("name")}
                sx={textFieldStyles}
                onBlur={() => setCrystalsVisible(false)}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
              {crystalsVisible && crystalMatches.length > 0 ? (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 123,
                    background: systemColors.slate,
                    padding: "12px 24px",
                  }}
                >
                  {crystalMatches.map((crystal) => {
                    return (
                      <Box key={crystal.id} sx={{ margin: "6px 0" }}>
                        {crystal.name}
                      </Box>
                    )
                  })}
                </Box>
              ) : null}
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "0px" }}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  select
                  label="Color"
                  id="colorId"
                  {...formik.getFieldProps("colorId")}
                  sx={textFieldStyles}
                  error={formik.touched.colorId && Boolean(formik.errors.colorId)}
                >
                  <MenuItem>
                    <Button onClick={() => setColorModalOpen(true)} sx={{ width: "100%" }}>
                      Add New...
                    </Button>
                  </MenuItem>
                  {colors.map((colorOption) => {
                    return (
                      <MenuItem key={colorOption.id} value={colorOption.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            textTransform: "capitalize",
                            width: "100%",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
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
                          <EditIcon
                            sx={{ color: "#708090", cursor: "pointer" }}
                            onClick={(e) => handleColorEdit(e, colorOption)}
                          />
                        </Box>
                      </MenuItem>
                    )
                  })}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="categoryId"
                label="Category"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("categoryId")}
                sx={textFieldStyles}
                error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
              >
                <MenuItem>
                  <Button onClick={() => setCategoryModalOpen(true)} sx={{ width: "100%" }}>
                    Add New...
                  </Button>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textTransform: "capitalize",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>{category.name}</Box>
                      <EditIcon
                        sx={{ color: "#708090", cursor: "pointer" }}
                        onClick={(e) => handleCategoryEdit(e, category)}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "0px" }}>
            <Grid item xs={6}>
              <TextField
                id="locationId"
                label="Location"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("locationId")}
                sx={textFieldStyles}
                error={formik.touched.locationId && Boolean(formik.errors.locationId)}
              >
                <MenuItem>
                  <Button onClick={() => setLocationModalOpen(true)} sx={{ width: "100%" }}>
                    Add New...
                  </Button>
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textTransform: "capitalize",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>{location.name}</Box>
                      <EditIcon
                        sx={{ color: "#708090", cursor: "pointer" }}
                        onClick={(e) => handleLocationEdit(e, location)}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
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
          colorToEdit={colorToEdit}
          onClose={() => {
            setColorModalOpen(false)
            setColorToEdit(null)
            setTimeout(() => {
              fetchColors()
            }, 1000)
          }}
        />
      )}
      {locationModalOpen && (
        <NewLocationModal
          locationToEdit={locationToEdit}
          onClose={() => {
            setLocationModalOpen(false)
            setLocationToEdit(null)
          }}
        />
      )}
      {categoryModalOpen && (
        <NewCategoryModal
          categoryToEdit={categoryToEdit}
          onClose={() => {
            setCategoryModalOpen(false)
            setCategoryToEdit(null)
          }}
        />
      )}
    </>
  )
}

export default NewCrystal
