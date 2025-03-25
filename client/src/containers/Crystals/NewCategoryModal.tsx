import { useState } from "react"
import { Modal, Box, TextField, Button, Typography } from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import ConfirmDialogue from "../../components/ConfirmDialogue"
import { useCategoryStore } from "../../store/categoryStore"
import colors from "../../styles/colors"

const NewCategoryModal = ({ onClose, categoryToEdit }) => {
  const { createCategory, updateCategory, deleteCategory } = useCategoryStore()
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)

  const initialValues = {
    name: categoryToEdit?.name || "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (categoryToEdit) {
        updateCategory(categoryToEdit.id, values)
      } else {
        createCategory(values)
      }
      formik.resetForm()
      onClose()
    },
  })

  const handleDeleteCategory = () => {
    deleteCategory(categoryToEdit?.id)
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
          bgcolor: colors.slateGrey,
          border: `1px solid ${colors.slateGrey}`,
          width: 400,
          p: 3,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: 600, marginBottom: "12px" }}>
          {categoryToEdit ? "Update" : "Create"} Category
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
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: colors.slate,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.slate,
                },
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "24px",
            }}
          >
            {categoryToEdit ? (
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
              {categoryToEdit ? "Update" : "Create"} Category
            </Button>
          </Box>
        </form>
        <ConfirmDialogue
          open={deleteConfirmVisible}
          onClose={() => setDeleteConfirmVisible(false)}
          onConfirm={handleDeleteCategory}
        />
      </Box>
    </Modal>
  )
}

export default NewCategoryModal
