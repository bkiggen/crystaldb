import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  Box,
  TextField,
  Button,
  FormControl,
  CircularProgress,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"

import systemColors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { monthOptions } from "../../lib/constants"

import { useColorStore } from "../../store/colorStore"
import { useCrystalStore } from "../../store/crystalStore"
import { useCategoryStore } from "../../store/categoryStore"
import { useLocationStore } from "../../store/locationStore"

import type { ColorT } from "../../types/Color"
import type { CategoryT } from "../../types/Category"
import type { LocationT } from "../../types/Location"
import type { CrystalT } from "../../types/Crystal"

import { sizeOptions, inventoryOptions } from "../../types/Crystal"

import ModalContainer from "../../components/Modals/ModalContainer"
import ConfirmDialogue from "../../components/ConfirmDialogue"
import NewColorModal from "./NewColorModal"
import NewLocationModal from "./NewLocationModal"
import NewCategoryModal from "./NewCategoryModal"

type UpdateCrystalModalT = {
  listCrystal: CrystalT
  onClose: () => void
}

const UpdateCrystalModal = ({ listCrystal, onClose }: UpdateCrystalModalT) => {
  const [crystal, setCrystal] = useState(listCrystal)
  const { updateCrystal, deleteCrystal, fetchCrystalById, setSelectedCrystal, selectedCrystal } =
    useCrystalStore()
  const { colors, fetchColors } = useColorStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { locations, fetchLocations } = useLocationStore()

  useEffect(() => {
    if (!colors?.length) {
      fetchColors()
    }
    if (!categories?.length) {
      fetchCategories()
    }
    if (!locations?.length) {
      fetchLocations()
    }
  }, [])

  useEffect(() => {
    if (!selectedCrystal) {
      fetchCrystalById(crystal.id)
    }
    return () => setSelectedCrystal(null)
  }, [crystal?.id])

  useEffect(() => {
    if (selectedCrystal) {
      setCrystal(selectedCrystal)
    }
  }, [selectedCrystal])

  const [colorToEdit, setColorToEdit] = useState<ColorT[]>(null)
  const [colorModalOpen, setColorModalOpen] = useState(false)
  const [locationToEdit, setLocationToEdit] = useState<LocationT[]>(null)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryT[]>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)

  const initialValues = {
    name: crystal.name,
    colorId: crystal.color?.id,
    categoryId: crystal.category?.id,
    locationId: crystal.location?.id,
    inventory: crystal.inventory,
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    colorId: Yup.number().integer().nullable(),
    categoryId: Yup.number().nullable(),
    size: Yup.mixed().oneOf(sizeOptions).nullable(),
    locationId: Yup.number().nullable(),
    inventory: Yup.mixed().oneOf(inventoryOptions),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      updateCrystal(crystal.id, values)
      onClose()
    },
  })

  const onDelete = async () => {
    deleteCrystal(crystal.id)
    onClose()
  }

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
    <ModalContainer
      open
      onClose={onClose}
      title="Update Crystal"
      paperStyles={{ maxWidth: "600px", width: "100%" }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            background: systemColors.slateA4,
            padding: "24px",
            paddingTop: "48px",
            margin: "0 auto",
            borderRadius: "4px",
          }}
        >
          <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                {...formik.getFieldProps("name")}
                sx={{ ...textFieldStyles, "*": { textTransform: "capitalize" } }}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <TextField
                  select
                  label="Color"
                  id="colorId"
                  {...formik.getFieldProps("colorId")}
                  sx={textFieldStyles}
                  error={formik.touched.colorId && Boolean(formik.errors.colorId)}
                  helperText={formik.touched.colorId && formik.errors.colorId}
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
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
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
                helperText={<>{formik.touched.categoryId && formik.errors.categoryId}</>}
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
            <Grid item xs={6}>
              <TextField
                id="locationId"
                label="Location"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("locationId")}
                sx={textFieldStyles}
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
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
            <Grid item xs={12}>
              <TextField
                id="inventory"
                label="Inventory"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("inventory")}
                sx={textFieldStyles}
                error={formik.touched.inventory && Boolean(formik.errors.inventory)}
                helperText={formik.touched.inventory && formik.errors.inventory}
              >
                {inventoryOptions.map((inventory) => (
                  <MenuItem key={inventory} value={inventory}>
                    {inventory}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteConfirmVisible(true)}
              sx={{ marginRight: "16px" }}
            >
              Delete
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Crystal
            </Button>
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ color: "white", marginBottom: "12px", marginTop: "48px" }}
            >
              Shipments:
            </Typography>
            {crystal.shipments === undefined ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              crystal.shipments?.map((shipment) => {
                return (
                  <Box
                    key={shipment.id}
                    sx={{
                      display: "flex",
                      border: "1px solid white",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <Typography sx={{ color: "white" }}>
                      {shipment.subscription?.shortName} {shipment.cycle}:{" "}
                      {monthOptions[shipment.month]?.long} {shipment.year}
                    </Typography>
                  </Box>
                )
              })
            )}
          </Box>
        </Box>
      </form>
      {colorModalOpen && (
        <NewColorModal
          colorToEdit={colorToEdit}
          onClose={() => {
            setColorModalOpen(false)
            setTimeout(fetchColors, 500)
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
      <ConfirmDialogue
        open={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
        onConfirm={onDelete}
      />
    </ModalContainer>
  )
}

export default UpdateCrystalModal
