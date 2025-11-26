// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/COMPONENTS/MODAL/MODAL.JS

"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { useUi } from "@/context/UiContext";

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
        <Box {...modalContentContainerProps}>{content}</Box>
      </Modal>{" "}
    </>
  );
}
export const modalContentContainerProps = {
  className: "modalContent--container",
  sx: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    // width: "50ch",
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
    width: {
      xs: "80%",
      sm: "70%",
      md: "50%",
      lg: "40%",
      xl: "40%",
    },
    // height: "100%",
    // height: "100vh",
    // maxWidth: {
    //   xs: "40ch", // 90% width on extra small screens
    //   sm: "40ch", // 600px max width on small screens and up
    //   md: "50ch", // 50 character width on medium screens and up
    // },
    // maxHeight: "100%",
    bgcolor: "background.paper",
    border: "1px solid #ffffff20",
    borderRadius: `baseValues.borderRadius`,
    boxShadow: 24,
    p: {
      xs: 2,
      sm: 2,
      md: 3,
      lg: 3,
      xl: 4,
    },
  },
};
