import { useEffect, useState } from "react"
import { useFormik } from "formik"
import systemColors from "../../styles/colors"

import * as Yup from "yup"
import { Box, TextField, Button, MenuItem, FormControl, Grid } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"

import { textFieldStyles } from "../../styles/vars"

import {
  rarityOptions,
  findAgeOptions,
  sizeOptions,
  inventoryOptions,
  categoryOptions,
  locationOptions,
} from "../../types/Crystal"
import type { ColorT } from "../../types/Color"
import type { RarityT, FindAgeT, SizeT, InventoryT } from "../../types/Crystal"

import { useCrystalStore } from "../../store/crystalStore"

import useDebounce from "../../hooks/useDebounce"
import capitalizeFirstLetter from "../../util/capitalizeFirstLetter"

import { useColorStore } from "../../store/colorStore"

import NewColorModal from "./NewColorModal"

const NewCrystal = () => {
  const { colors, fetchColors } = useColorStore()
  const { createCrystal, crystalMatches, fetchCrystalMatches } = useCrystalStore()
  const [colorToEdit, setColorToEdit] = useState<ColorT[]>(null)
  const [colorModalOpen, setColorModalOpen] = useState(false)

  const [crystalsVisible, setCrystalsVisible] = useState(false)
  const [rawSearch, setRawSearch] = useState(null)
  const debouncedSearch = useDebounce(rawSearch, 300)

  const initialValues: {
    name?: string
    colorId?: number
    category?: string
    location?: string
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
    location: "",
    rarity: undefined,
    description: "",
    image: "",
    findAge: undefined,
    size: "M",
    inventory: "MEDIUM",
  }

  const validationSchema: Yup.Schema<typeof initialValues> = Yup.object({
    name: Yup.string().required("Name is required"),
    colorId: Yup.number().integer(),
    category: Yup.string(),
    location: Yup.string(),
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
      category: formData.category,
      rarity: formData.rarity,
      description: formData.description,
      image: formData.image,
      findAge: formData.findAge,
      size: formData.size,
      inventory: formData.inventory,
      location: formData.location,
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

  // const indicatorOptions = (indicatorName, indicatorValues) => {
  //   return indicatorValues.map((value) => (
  //     <MenuItem key={value} value={value}>
  //       <Box sx={{ display: "flex", alignItems: "center" }}>
  //         <ColorIndicator indicatorType={indicatorName} indicatorValue={value} />
  //         {value}
  //       </Box>
  //     </MenuItem>
  //   ))
  // }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            background: systemColors.slateA4,
            border: "1px solid #fff",
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
            <Grid item xs={6}>
              <TextField
                id="location"
                label="Location"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("location")}
                sx={textFieldStyles}
              >
                {locationOptions.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
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
    </>
  )
}

export default NewCrystal
