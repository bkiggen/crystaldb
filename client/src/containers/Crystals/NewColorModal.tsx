import React from "react"
import { Modal, Box, TextField, Button, Typography } from "@mui/material"

import { HexColorPicker } from "react-colorful"

import { useFormik } from "formik"
import * as Yup from "yup"

import { createColor } from "../../api/colors"

const ColorCreationModal = ({ onClose }) => {
  const initialValues = {
    name: "",
    hex: "",
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
      createColor(values)
      formik.resetForm()
      onClose()
    },
  })

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
        <Typography variant="h6">Create a New Color</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            label="Name"
            variant="outlined"
            margin="normal"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <HexColorPicker
            color={formik.values.hex}
            onChange={(val) => formik.setFieldValue("hex", val)}
          />
          ;
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
          >
            Create Color
          </Button>
        </form>
      </Box>
    </Modal>
  )
}

export default ColorCreationModal
