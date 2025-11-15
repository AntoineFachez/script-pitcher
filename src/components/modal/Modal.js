// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/MODAL/MODAL.JS

"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { modalStyles } from "@/theme/muiProps";

export default function BasicModal({ content, open, setOpen }) {
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyles.sx}>{content}</Box>
      </Modal>
    </>
  );
}
