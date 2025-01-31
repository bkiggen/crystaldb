import React from "react"
import { Modal, Paper, Typography, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import colors from "../../styles/colors"

type ModalContainerT = {
  children: React.ReactNode
  onClose: (arg: null) => void
  open: boolean
  modalStyles?: Record<string, unknown>
  paperStyles?: Record<string, unknown>
  title?: string
}

const ModalContainer = ({
  children,
  onClose,
  open,
  modalStyles = {},
  paperStyles = {},
  title,
}: ModalContainerT) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        maxHeight: "50hv",
        overflowY: "auto",
        backgroundColor: colors.slateA4,
        "& .MuiPaper-root": {
          margin: "15% auto",
          width: "50vw",
          maxWidth: "1000px",
          minWidth: "400px",
          padding: "40px",
          ...paperStyles,
        },
        ...modalStyles,
      }}
    >
      <Paper
        sx={{ outline: "none", background: colors.slate, position: "relative", padding: "32px" }}
      >
        <IconButton
          onClick={() => onClose(null)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
        {title && (
          <Typography
            sx={{
              fontSize: "42px",
              textAlign: "center",
              marginBottom: "12px",
              color: "white",
            }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Paper>
    </Modal>
  )
}

export default ModalContainer
