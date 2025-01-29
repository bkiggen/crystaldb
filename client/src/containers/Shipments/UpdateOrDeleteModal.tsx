import { Box, Button, Typography, Popover } from "@mui/material"

const UpdateOrDeleteModal = ({ buttonRef, open, onClose, onConfirm }) => {
  return (
    <Popover
      open={open}
      anchorEl={buttonRef.current}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle1">Choose an option:</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose()
            onConfirm("update")
          }}
        >
          Update Selected
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            onClose()
            onConfirm("delete")
          }}
        >
          Delete Selected
        </Button>
      </Box>
    </Popover>
  )
}

export default UpdateOrDeleteModal
