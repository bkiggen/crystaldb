import { Box, Button, Typography, Popover } from "@mui/material"

const ConfirmModal = ({ buttonRef, open, onClose, onConfirm, isEditMode }) => {
  const actionName = isEditMode ? "Update" : "Delete"

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
        <Typography variant="subtitle1">Please Confirm</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose()
            onConfirm({ isBulkEdit: false })
          }}
        >
          {actionName}
        </Button>
        {/* <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            onClose()
            onConfirm({ isBulkEdit: true })
          }}
        >
          Bulk {actionName}
        </Button> */}
      </Box>
    </Popover>
  )
}

export default ConfirmModal
