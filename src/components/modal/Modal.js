// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/MODAL/MODAL.JS

"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { modalStyles } from "@/theme/muiProps";
import BasicDrawer from "../drawer/Drawer";
import { useUi } from "@/context/UiContext";
import { IconButton } from "@mui/material";
import { ViewSidebar } from "@mui/icons-material";

export default function BasicModal({ content, open, setOpen }) {
  const {
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    orientationDrawer,
    handleToggleDrawer,
  } = useUi();
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // hideBackdrop={orientationDrawer.bottom}
        // disableEnforceFocus={orientationDrawer.bottom}
        sx={{ zIndex: orientationDrawer.bottom ? 10 : 100 }}
      >
        <Box sx={modalStyles.sx}>{content}</Box>
      </Modal>{" "}
    </>
  );
}
