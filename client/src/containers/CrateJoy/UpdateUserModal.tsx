import { useState } from "react"
import ModalContainer from "../../components/Modals/ModalContainer"
import { Box, TextField, Button, Grid, Typography } from "@mui/material"
import { textFieldStyles } from "../../styles/vars"
import { callCratejoyApi } from "../../api/cratejoy"

const UpdateUserModal = ({ user, open, onClose }) => {
  const [formData, setFormData] = useState(
    user
      ? {
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          email: user?.email || "",
          country: user?.country || "",
          subscription_status: user?.subscription_status || "",
        }
      : null,
  )
  const [searchId, setSearchId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchId(e.target.value)
  }

  // Fetch user data by ID
  const handleSearch = async () => {
    setLoading(true)
    setError("") // Reset any previous errors
    try {
      const response: any = await callCratejoyApi({
        method: "GET",
        path: `/customers/${searchId}`,
      })

      console.log("🚀 ~ handleSearch ~ response:", response)
      // If user is found, populate the form
      setFormData({
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
        country: response.country,
        subscription_status: response.subscription_status,
      })
    } catch (err) {
      // Handle errors (e.g., user not found)
      console.error("Error fetching user:", err)
      setError("User not found. Please try again.")
      setFormData(null) // Clear the form
    } finally {
      setLoading(false)
    }
  }

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    console.log("Updated User Data:", formData)
    // Update user data via API
    try {
      const response: any = await callCratejoyApi({
        method: "PUT",
        path: `/customers/${searchId}`,
        body: formData,
      })
      console.log("🚀 ~ handleSave ~ response:", response)
    } catch (err) {
      console.error("Error saving user data:", err)
      setError("Failed to save user data. Please try again.")
    }
  }

  return (
    <ModalContainer open={open} onClose={onClose} title="User Details">
      {formData ? (
        <Box component="form" sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            {/* Last Name */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            {/* Country */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            {/* Subscription Status */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Subscription Status"
                name="subscription_status"
                value={formData.subscription_status}
                onChange={handleInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            {/* Buttons */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ padding: 2 }}>
          <TextField
            fullWidth
            label="Search by ID"
            name="search"
            value={searchId}
            onChange={handleSearchInputChange}
            sx={textFieldStyles}
          />
          {error && (
            <Typography color="error" sx={{ marginTop: 1 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </Box>
      )}
    </ModalContainer>
  )
}

export default UpdateUserModal
