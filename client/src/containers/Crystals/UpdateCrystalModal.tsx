import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Box, TextField, Button, FormControl, Grid, MenuItem } from "@mui/material"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"
import { getAllColors } from "../../api/colors"
import { updateCrystal } from "../../api/crystals"
import ModalContainer from "../../components/Modals/ModalContainer"
import type { CrystalT } from "../../types/Crystal"
import {
  rarityOptions,
  findAgeOptions,
  sizeOptions,
  inventoryOptions,
  categoryOptions,
} from "../../types/Crystal"
import type { ColorT } from "../../types/Color"
import NewColorModal from "./NewColorModal"

type UpdateCrystalModalT = {
  crystal: CrystalT
  onClose: () => void
  refreshCrystals: () => void
}

const UpdateCrystalModal = ({ crystal, onClose, refreshCrystals }: UpdateCrystalModalT) => {
  const [colorOptions, setColorOptions] = useState<ColorT[]>([])
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false)

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
    rarity: crystal.rarity,
    description: crystal.description,
    image: crystal.image,
    findAge: crystal.findAge,
    size: crystal.size,
    inventory: crystal.inventory,
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    colorId: Yup.number().integer().nullable(),
    category: Yup.string().nullable(),
    rarity: Yup.mixed().oneOf(rarityOptions),
    description: Yup.string().nullable(),
    image: Yup.string().url("Must be a valid URL").nullable(),
    findAge: Yup.mixed().oneOf(findAgeOptions),
    size: Yup.mixed().oneOf(sizeOptions).nullable(),
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
                id="rarity"
                label="Rarity"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("rarity")}
                sx={textFieldStyles}
                error={formik.touched.rarity && Boolean(formik.errors.rarity)}
                helperText={formik.touched.rarity && formik.errors.rarity}
              >
                {rarityOptions.map((rarity) => (
                  <MenuItem key={rarity} value={rarity}>
                    {rarity}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
            <Grid item xs={6}>
              <TextField
                id="findAge"
                label="Find Age"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("findAge")}
                sx={textFieldStyles}
                error={formik.touched.findAge && Boolean(formik.errors.findAge)}
                helperText={formik.touched.findAge && formik.errors.findAge}
              >
                {findAgeOptions.map((findAge) => (
                  <MenuItem key={findAge} value={findAge}>
                    {findAge}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="size"
                label="Size"
                variant="outlined"
                fullWidth
                select
                {...formik.getFieldProps("size")}
                sx={textFieldStyles}
                error={formik.touched.size && Boolean(formik.errors.size)}
                helperText={formik.touched.size && formik.errors.size}
              >
                {sizeOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                {...formik.getFieldProps("description")}
                sx={textFieldStyles}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
          </Grid>
          <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" color="primary">
              Update Crystal
            </Button>
          </Box>
        </Box>
      </form>
      {colorModalOpen && (
        <NewColorModal
          onClose={() => {
            setColorModalOpen(false)
            setTimeout(fetchColors, 500)
          }}
        />
      )}
    </ModalContainer>
  )
}

export default UpdateCrystalModal
