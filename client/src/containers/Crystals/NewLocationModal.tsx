import { useState } from "react"
import { Modal, Box, TextField, Button, Typography } from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import ConfirmDialogue from "../../components/ConfirmDialogue"
import { useLocationStore } from "../../store/locationStore"

const NewLocationModal = ({ onClose, locationToEdit }) => {
  const { createLocation, updateLocation, deleteLocation } = useLocationStore()
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)

  const initialValues = {
    name: locationToEdit?.name || "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (locationToEdit) {
        updateLocation(locationToEdit.id, values)
      } else {
        createLocation(values)
      }
      formik.resetForm()
      onClose()
    },
  })

  const handleDeleteLocation = () => {
    deleteLocation(locationToEdit?.id)
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
          {locationToEdit ? "Update" : "Create"} Location
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            label="Name"
            variant="outlined"
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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            {locationToEdit ? (
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
              {locationToEdit ? "Update" : "Create"} Location
            </Button>
          </Box>
        </form>
        <ConfirmDialogue
          open={deleteConfirmVisible}
          onClose={() => setDeleteConfirmVisible(false)}
          onConfirm={handleDeleteLocation}
        />
      </Box>
    </Modal>
  )
}

export default NewLocationModal
