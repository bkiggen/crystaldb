import { Box, Button, Popover } from "@mui/material"

const UpdateOrDeleteModal = ({ buttonRef, open, onClose, setConfirmDelete, setConfirmUpdate }) => {
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose()
            setConfirmUpdate()
          }}
        >
          Update Selected
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            onClose()
            setConfirmDelete()
          }}
        >
          Delete Selected
        </Button>
      </Box>
    </Popover>
  )
}

export default UpdateOrDeleteModal
