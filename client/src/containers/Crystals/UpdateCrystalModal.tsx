import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Box, TextField, Button, FormControl, Grid, MenuItem } from "@mui/material"

import systemColors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import { useColorStore } from "../../store/colorStore"
import { useCrystalStore } from "../../store/crystalStore"
import { useCategoryStore } from "../../store/categoryStore"
import { useLocationStore } from "../../store/locationStore"

import type { CrystalT } from "../../types/Crystal"

import { sizeOptions, inventoryOptions } from "../../types/Crystal"

import ModalContainer from "../../components/Modals/ModalContainer"
import NewColorModal from "./NewColorModal"
import ConfirmDialogue from "../../components/ConfirmDialogue"

type UpdateCrystalModalT = {
  crystal: CrystalT
  onClose: () => void
}

const UpdateCrystalModal = ({ crystal, onClose }: UpdateCrystalModalT) => {
  const { updateCrystal, deleteCrystal } = useCrystalStore()
  const { colors, fetchColors } = useColorStore()
  const { categories } = useCategoryStore()
  const { locations } = useLocationStore()

  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false)
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
                  {colors.map((color) => (
                    <MenuItem key={color.id} value={color.id}>
                      {color.name}
                    </MenuItem>
                  ))}
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
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
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
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
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
        </Box>
      </form>
      {colorModalOpen && (
        <NewColorModal
          colorToEdit={null}
          onClose={() => {
            setColorModalOpen(false)
            setTimeout(fetchColors, 500)
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
