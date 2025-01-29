import { useState } from "react"

import { Modal, Box, TextField, Button, Typography } from "@mui/material"

import { HexColorPicker } from "react-colorful"

import { useFormik } from "formik"
import * as Yup from "yup"

import ConfirmDialogue from "../../components/ConfirmDialogue"

import { useColorStore } from "../../store/colorStore"

const ColorCreationModal = ({ onClose, colorToEdit }) => {
  const { createColor, updateColor, deleteColor } = useColorStore()
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)
  const initialValues = {
    name: colorToEdit?.name || "",
    hex: colorToEdit?.hex || "#000000",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    hex: Yup.string()
      .matches(/^#[0-9A-Fa-f]{6}$/, "Hex color code must be valid (e.g., #RRGGBB)")
      .required("Hex color code is required"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (colorToEdit) {
        updateColor(colorToEdit.id, values)
      } else {
        createColor(values)
      }
      formik.resetForm()
      onClose()
    },
  })

  const handleDeleteColor = () => {
    deleteColor(colorToEdit?.id)
    onClose()
  }

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          p: 3,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "black", fontWeight: 600, marginBottom: "12px" }}>
          {colorToEdit ? "Update" : "Create"} Color
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            label="Name"
            margin="normal"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={<>{formik.touched.name ? formik.errors.name : ""}</>}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "black", // Default black outline
                },
                "&:hover fieldset": {
                  borderColor: "black", // Black outline on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black", // Black outline when focused
                },
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "36px 0 48px 0",
            }}
          >
            <HexColorPicker
              color={formik.values.hex}
              onChange={(val) => formik.setFieldValue("hex", val)}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            {colorToEdit ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteConfirmVisible(true)}
              >
                X
              </Button>
            ) : null}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginLeft: "24px" }}
            >
              {colorToEdit ? "Update" : "Create"} Color
            </Button>
          </Box>
        </form>
        <ConfirmDialogue
          open={deleteConfirmVisible}
          onClose={() => setDeleteConfirmVisible(false)}
          onConfirm={handleDeleteColor}
        />
      </Box>
    </Modal>
  )
}

export default ColorCreationModal
