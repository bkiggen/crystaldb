import React from "react"
import { Modal, Paper, Typography } from "@mui/material"
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
        backgroundColor: colors.slate,
        "& .MuiPaper-root": {
          margin: "15% auto",
          width: "50vw",
          maxWidth: "1000px",
          minWidth: "400px",
          padding: "24px",
          ...paperStyles,
        },
        ...modalStyles,
      }}
    >
      <Paper sx={{ outline: "none", background: colors.slateGrey }}>
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
