"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Typography,
  Alert,
  Autocomplete,
  Chip,
  LinearProgress,
} from "@mui/material";

// Shared Architecture
import BaseCrudForm from "./BaseCrudForm";

// Contexts & Components
import { useAuth } from "@/context/AuthContext";
import { useCrud } from "@/context/CrudItemContext";
import { useUi } from "@/context/UiContext";
import BasicSelect from "@/components/select/BasicSelect";
import FileUploader from "./FileUploader";

export default function CrudProjectForm({ crud, projectInFocus }) {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const { crudProject, setCrudProject, clearCrudProjectDraft } = useCrud();
  const { setOpenModal } = useUi();

  // Local state for tags (Genres, Formats)
  const [genres, setGenres] = useState([]);
  const [formats, setFormats] = useState([]);

  // Local state for file/form
  const [file, setFile] = useState(null);
  const [filePurpose, setFilePurpose] = useState("");

  // Status/Upload state (unique to this form's submission process)
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

    if (!firebaseUser) {
      setError("You must be logged in.");
      return;
    }
    if (!crudProject?.title || genres.length === 0 || formats.length === 0) {
      setError("Project Title, Genre, and Format are required.");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    // Transform local tag arrays back into the required object structure
    const genresArray = genres.map((g) => ({ genre: g }));
    const formatsArray = formats.map((f) => ({ format: f }));

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

        // 1. Initiate Upload API call to get Signed URL
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

        // 2. Perform File Upload using XHR (needed for progress tracking)
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
            setOpenModal(false);
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

        // Note: XHR is asynchronous. isUploading is set to false in the xhr callbacks.
      } else if (crud === "update") {
        // Simple JSON PUT update
        const projectId = projectInFocus?.id;
        if (!projectId) {
          throw new Error("No project is in focus. Cannot update.");
        }

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
        setOpenModal(false);
        setIsUploading(false); // Manually set false here since XHR isn't running
      }
    } catch (err) {
      setError(err.message);
      setIsUploading(false); // Ensure loading stops on catch block
    }
  };

  // Helper to convert [{genre: "Drama"}] to ["Drama"] for Autocomplete
  const getTagArray = (array, key) => {
    if (Array.isArray(array)) {
      return array.map((item) => item[key]);
    }
    return [];
  };

  // Effect to populate state on 'update' or clear on 'create'
  useEffect(() => {
    if (crud === "update" && projectInFocus) {
      setCrudProject(projectInFocus);
      setGenres(getTagArray(projectInFocus.genres, "genre"));
      setFormats(getTagArray(projectInFocus.formats, "format"));
    } else if (crud === "create") {
      clearCrudProjectDraft();
      setGenres([]);
      setFormats([]);
    }

    // Cleanup function
    return () => {
      // It's usually better to keep the state in context clear
      clearCrudProjectDraft();
      setGenres([]);
      setFormats([]);
    };
  }, [crud, projectInFocus, setCrudProject, clearCrudProjectDraft]);

  // Effect to generate Project ID on 'create'
  useEffect(() => {
    if (crud === "create") {
      const formattedTitle =
        crudProject?.title?.trim().replace(/ /g, "-") || "";
      const formattedPurpose = filePurpose?.trim().replace(/ /g, "-") || "";
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
    formats, // Dependency on local state
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

  return (
    <BaseCrudForm
      title={
        crud === "create"
          ? "Create New Project"
          : crud === "update"
          ? "Edit Project"
          : "Project Details"
      }
      formData={crudProject}
      setFormData={setCrudProject} // Allows the Base component's Drawer to update images
      onSubmit={handleSubmit}
      loading={isUploading}
      error={error}
      success={success}
      submitButtonText={crud === "create" ? "Create Project" : "Save Changes"}
    >
      {/* --- CONTENT SPECIFIC TO PROJECTS --- */}
      <TextField
        label="Project Title"
        name="title"
        value={crudProject?.title || ""}
        onChange={handleChange}
        required={crud === "create"}
      />

      {/* BasicSelect uses props directly instead of context, so we pass them */}
      <BasicSelect
        selectOptions={selectOptions}
        crudProject={crudProject}
        setCrudProject={setCrudProject}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={genres}
        onChange={(event, newValue) => setGenres(newValue)}
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
        onChange={(event, newValue) => setFormats(newValue)}
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
      <TextField
        label="Logline"
        name="logline"
        value={crudProject?.logline || ""}
        onChange={handleChange}
        multiline
        rows={3}
      />

      {crud === "create" && (
        <Box sx={{ mt: 1 }}>
          <FileUploader
            onFileChange={setFile}
            onPurposeChange={setFilePurpose}
            initialPurpose={filePurpose}
          />
          {isUploading && uploadProgress > 0 && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Upload Progress: {uploadProgress.toFixed(1)}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </Box>
      )}

      {crud === "update" && (
        <Typography
          variant="caption"
          sx={{ textAlign: "center", color: "text.secondary", mt: 2 }}
        >
          File uploads are handled in the `Files` tab after creation.
        </Typography>
      )}
    </BaseCrudForm>
  );
}
