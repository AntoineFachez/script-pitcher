// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/PROJECTFORM.JS

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Paper,
  Typography,
  Alert,
  Button,
  LinearProgress,
  Autocomplete, // <-- 1. IMPORT Autocomplete
  Chip,
  IconButton,
} from "@mui/material";
import {
  Camera,
  CameraAlt,
  Edit,
  Save,
  ViewSidebar,
} from "@mui/icons-material";

import { useAuth } from "@/context/AuthContext";
import { useCrud } from "@/context/CrudItemContext";
import { useInFocus } from "@/context/InFocusContext";
import { useUi } from "@/context/UiContext";

import AllProjectImages from "@/components/imageGallery/ImageGallery";
import BasicAvatar from "@/components/avatar/Avatar";
import BasicDrawer from "@/components/drawer/Drawer";
import BasicSelect from "@/components/select/BasicSelect";

import FileUploader from "./FileUploader";
import Banner from "@/components/profileBanner/Banner";

export default function CrudProjectForm({ crud }) {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const { projectInFocus } = useInFocus();
  const { crudProject, setCrudProject, clearCrudProjectDraft } = useCrud();
  const {
    modalContent,
    setModalContent,
    openModal,
    setOpenModal,
    orientationDrawer,
    handleToggleDrawer,
  } = useUi();
  // --- 3. USE LOCAL STATE FOR TAGS ---
  // This is much cleaner than storing the string in the context
  const [genres, setGenres] = useState([]);
  const [formats, setFormats] = useState([]);
  // --- END ---

  // Local state for file/form
  const [file, setFile] = useState(null);
  const [filePurpose, setFilePurpose] = useState("");

  // Local state for images
  const [selectedImageUrlContext, setSelectedImageUrlContext] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  // This handler updates the main project data in the context
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCrudProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 4. VALIDATION IS SIMPLER ---
    if (!firebaseUser) {
      setError("You must be logged in.");
      return;
    }
    // Check local state arrays
    if (!crudProject?.title || genres.length === 0 || formats.length === 0) {
      setError("Project Title, Genre, and Format are required.");
      return;
    }
    // --- END ---

    setIsUploading(true);
    setError("");
    setSuccess("");

    // --- 5. TRANSFORMATION IS SIMPLER ---
    // From ["Drama", "Comedy"] to [{genre: "Drama"}, {genre: "Comedy"}]
    const genresArray = genres.map((g) => ({ genre: g }));
    const formatsArray = formats.map((f) => ({ format: f }));
    // --- END ---

    const projectData = {
      title: crudProject?.title,
      genres: genresArray,
      formats: formatsArray,
      logline: crudProject?.logline || "",
      status: crudProject?.status,
      published: crudProject?.published || false,
      avatarUrl: crudProject?.avatarUrl || null,
      bannerUrl: crudProject?.bannerUrl || null,
    };

    try {
      if (crud === "create") {
        // --- (This logic remains the same) ---
        if (!file || !filePurpose) {
          throw new Error("A PDF file and a file purpose are required.");
        }
        if (file.type !== "application/pdf") {
          throw new Error("Only PDF files are allowed.");
        }
        const fileMetadata = {
          filePurpose,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        };

        const response = await fetch("/api/uploads/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
          },
          body: JSON.stringify({ projectData, fileMetadata }),
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to prepare upload.");
        }
        const { signedUrl, projectId } = await response.json();

        // (XHR logic remains the same)
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress((event.loaded / event.total) * 100);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setSuccess(`Successfully created project "${crudProject?.title}".`);
            clearCrudProjectDraft();
            setFile(null);
            setFilePurpose("");
            setUploadProgress(0);
            router.push(`/projects/${projectId}`);
          } else {
            setError(
              "File upload failed. Server responded with: " + xhr.status
            );
          }
        };
        xhr.onerror = () => setError("Upload failed. Network error.");
        xhr.send(file);
      } else if (crud === "update") {
        // --- (This logic remains the same) ---
        const projectId = projectInFocus?.id;
        if (!projectId) {
          throw new Error("No project is in focus. Cannot update.");
        }
        if (file) {
          console.warn("File upload during 'update' is not handled.");
        }
        // console.log("projectId", projectId);
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
          },
          body: JSON.stringify({ projectData }),
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to update project.");
        }
        setSuccess("Successfully updated project!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (crud === "update") setIsUploading(false); // Only set for update
    }
  };

  // --- 6. useEffect IS NOW CLEANER ---
  useEffect(() => {
    // Helper to convert [{genre: "Drama"}] to ["Drama"]
    const getTagArray = (array, key) => {
      if (Array.isArray(array)) {
        return array.map((item) => item[key]);
      }
      return [];
    };

    if (crud === "update" && projectInFocus) {
      // Pre-fill the global context (for title, logline, etc.)
      setCrudProject(projectInFocus);

      // Pre-fill the local state for the Autocomplete components
      setGenres(getTagArray(projectInFocus.genres, "genre"));
      setFormats(getTagArray(projectInFocus.formats, "format"));
    } else if (crud === "create") {
      // Clear all state
      clearCrudProjectDraft();
      setGenres([]);
      setFormats([]);
    }

    return () => {
      clearCrudProjectDraft();
      setGenres([]);
      setFormats([]);
    };
  }, [crud, projectInFocus, setCrudProject, clearCrudProjectDraft]);
  // --- END ---

  // (This useEffect for projectId generation can stay the same)
  useEffect(() => {
    if (crud === "create") {
      const formattedTitle =
        crudProject?.title?.trim().replace(/ /g, "-") || "";
      const formattedPurpose = filePurpose?.trim().replace(/ /g, "-") || "";
      // Use the local 'formats' array now
      const firstFormat = (formats[0] || "").trim().replace(/ /g, "-");

      const crudProjectId = `${firstFormat}_${formattedTitle}_${formattedPurpose}`;

      if (crudProject?.projectId !== crudProjectId) {
        setCrudProject((prev) => ({
          ...prev,
          projectId: crudProjectId,
        }));
      }
    }
  }, [
    crud,
    crudProject?.title,
    formats, // Use local state
    filePurpose,
    crudProject?.projectId,
    setCrudProject,
  ]);
  const selectOptions = [
    { status: "concept phase" },
    { status: "under option" },
    { status: "in developement" },
    { status: "in production" },
    { status: "in postproduction" },
    { status: "completed" },
    { status: "rejected/ cancelled" },
    { status: "deleted" },
  ];
  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: "50vh",
        overflowY: "scroll",
      }}
    >
      <AllProjectImages
        setFormData={setCrudProject}
        imageType={selectedImageUrlContext}
      />
    </Box>
  );
  const bannerStyles = { topMargin: 0, leftMargin: 0 };
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
        width: "100%",
        mx: "auto",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", display: "flex", flexFlow: "row wrap" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 100 }}>
          {crud === "create"
            ? "Create New Project:"
            : crud === "update"
            ? "Edit Project"
            : "Project Details"}
        </Typography>
      </Box>{" "}
      <Box
        sx={{
          display: "flex",
          flexFlow: "row nowrap",
          width: "100%",
          height: "100%",
          maxHeight: "50vh",
          overflowY: "scroll",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexFlow: "row nowrap",
            width: "100%",
            height: "100%",
            maxHeight: "50vh",
            overflowY: "scroll",
          }}
        >
          {" "}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
              }}
            >
              <IconButton
                onClick={(e) => {
                  setSelectedImageUrlContext("bannerUrl");
                  handleToggleDrawer("bottom", true)(e);
                }}
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  right: -12,
                  bottom: -10,
                }}
              >
                <CameraAlt />
              </IconButton>{" "}
              <Banner imageUrl={crudProject.bannerUrl} />{" "}
            </Box>{" "}
            <Box
              sx={{
                position: "relative",
                width: "fit-content",
              }}
            >
              <IconButton
                onClick={(e) => {
                  setSelectedImageUrlContext("avatarUrl");
                  handleToggleDrawer("bottom", true)(e);
                }}
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  right: -12,
                  bottom: -10,
                }}
              >
                <CameraAlt />
              </IconButton>{" "}
              <BasicAvatar url={crudProject.avatarUrl} />{" "}
            </Box>
            <TextField
              label="Project Title"
              name="title"
              value={crudProject?.title || ""}
              onChange={handleChange}
              required={crud === "create" ? true : false}
            />
            <BasicSelect
              selectOptions={selectOptions}
              crudProject={crudProject}
              setCrudProject={setCrudProject}
            />
            {/* --- 7. REPLACE TEXTFIELDS WITH AUTOCOMPLETE --- */}
            <Autocomplete
              multiple
              freeSolo // Allows user to add new, custom values
              options={[]} // You can add pre-defined options here if you want
              value={genres}
              onChange={(event, newValue) => {
                setGenres(newValue); // Update the local string array
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Genres"
                  placeholder="Type and press Enter"
                />
              )}
            />
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formats}
              onChange={(event, newValue) => {
                setFormats(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Formats"
                  placeholder="Type and press Enter"
                />
              )}
            />
            {/* --- END --- */}
            <TextField
              label="Logline"
              name="logline"
              value={crudProject?.logline || ""}
              onChange={handleChange}
              multiline
              rows={3}
            />
            {crud === "create" && (
              <FileUploader
                onFileChange={setFile}
                onPurposeChange={setFilePurpose}
                initialPurpose={filePurpose}
              />
            )}
            {crud === "update" && (
              <Typography
                variant="caption"
                sx={{ textAlign: "center", color: "text.secondary" }}
              >
                File uploads are handled in the `Files` tab after creation.
              </Typography>
            )}
            {/* ... (rest of the form: errors, button, etc.) ... */}
            {isUploading && (
              <Box sx={{ width: "100%", mt: 1 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isUploading}
              sx={{ mt: 2 }}
              startIcon={<Save />}
            >
              {isUploading
                ? "Uploading..."
                : crud === "create"
                ? "Create Project"
                : "Save Changes"}
            </Button>{" "}
          </Box>{" "}
        </Box>{" "}
      </Box>
      <BasicDrawer
        handleToggleDrawer={handleToggleDrawer}
        orientationDrawer={orientationDrawer}
        // menu={menu}
        // goBack={goBack}
        // list={list}
        element={drawerContent}
      />
    </Paper>
  );
}
