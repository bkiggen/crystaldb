import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Box, TextField, Button, FormControl, Grid, MenuItem } from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { getAllColors } from "../../api/colors"
import { updateCrystal, deleteCrystal } from "../../api/crystals"

import type { CrystalT } from "../../types/Crystal"
import type { ColorT } from "../../types/Color"
import {
  sizeOptions,
  inventoryOptions,
  categoryOptions,
  locationOptions,
} from "../../types/Crystal"

import ModalContainer from "../../components/Modals/ModalContainer"
import NewColorModal from "./NewColorModal"
import ConfirmDialogue from "../../components/ConfirmDialogue"

type UpdateCrystalModalT = {
  crystal: CrystalT
  onClose: () => void
  refreshCrystals: () => void
}

const UpdateCrystalModal = ({ crystal, onClose, refreshCrystals }: UpdateCrystalModalT) => {
  const [colorOptions, setColorOptions] = useState<ColorT[]>([])
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false)
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)

  const fetchColors = async () => {
    const response = await getAllColors()
    setColorOptions(response || [])
  }

  useEffect(() => {
    fetchColors()
  }, [])

  const initialValues = {
    name: crystal.name,
    colorId: crystal.color?.id,
    category: crystal.category,
    location: crystal.location,
    inventory: crystal.inventory,
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    colorId: Yup.number().integer().nullable(),
    category: Yup.string().nullable(),
    size: Yup.mixed().oneOf(sizeOptions).nullable(),
    location: Yup.mixed().oneOf(locationOptions).nullable(),
    inventory: Yup.mixed().oneOf(inventoryOptions),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await updateCrystal(crystal.id, values)
      refreshCrystals()
      onClose()
    },
  })

  const onDelete = async () => {
    await deleteCrystal(crystal.id)
    refreshCrystals()
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
            background: colors.slateA4,
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
                sx={textFieldStyles}
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
                  {colorOptions.map((color) => (
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
                id="category"
                label="Category"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("category")}
                sx={textFieldStyles}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
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
