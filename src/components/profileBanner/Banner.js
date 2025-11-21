import { useApp } from "@/context/AppContext";
import { useUi } from "@/context/UiContext";
import CrudItem from "@/widgets/crudItem";
import { Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles"; // Import styled from @mui/material/styles
import React, { useEffect } from "react";

// 1. STYLED COMPONENT (CSS ONLY)
// This is a pure CSS wrapper for Box. It ONLY takes theme and props.
const BannerBase = styled(Box, {
  // This prop should not be forwarded to the underlying DOM element
  shouldForwardProp: (prop) => prop !== "scrollratio",
})(({ theme, imageUrl, scrollratio, newHeight }) => ({
  // 1. Set the fixed dimensions of the banner
  width: "100%",

  // 2. Add the background image (use background-image for best results)
  backgroundImage: `url(${imageUrl})`,

  // 3. Control how the image fills the space
  backgroundSize: "cover",
  backgroundPosition: `center ${scrollratio * 50}%`, // Gentle parallax effect
  backgroundRepeat: "no-repeat",

  // CSS transform is highly performant for motion
  transform: `translateY(${scrollratio * -30}px)`,
  transition: "transform 0.1s linear",

  // Optional: Add a rounded top edge for a modern look
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
}));

// 2. FUNCTIONAL COMPONENT (LOGIC + RENDERING)
export default function Banner({ imageUrl, scrollratio, newHeight }) {
  // HOOKS MUST BE AT THE TOP LEVEL OF THE FUNCTIONAL COMPONENT
  const { appContext } = useApp();
  const { setModalContent, openModal, setOpenModal } = useUi();

  // Side Effect: Prepare the modal content when component mounts or context changes
  useEffect(() => {
    // Note: CrudItem uses appContext, so it needs to be defined when appContext is ready
    setModalContent(
      <CrudItem context={appContext} crud="update" type="bannerImage" />
    );
  }, [appContext, setModalContent]);

  // Handler: Opens the modal that was set up in the useEffect
  const handleEditClick = () => {
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        // backgroundColor: "red",
        backgroundImage: `url(${imageUrl})`,
        // 3. Control how the image fills the space
        backgroundSize: "cover",
        backgroundPosition: `center ${scrollratio * 50}%`, // Gentle parallax effect
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Render the styled component and pass necessary props */}
      <BannerBase
        imageUrl={imageUrl}
        scrollratio={scrollratio}
        newHeight={newHeight}
      />
    </Box>
  );
}
