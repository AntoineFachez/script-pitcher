// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/FILEUPLOADER.JS

// file path: ~/DEVFOLD/SCRIPT-PITCHER/SRC/WIDGETS/CRUDITEM/FILEUPLOADER.JS

"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

/**
 * A "dumb" component for file input UI.
 * It passes the file and filePurpose up to its parent.
 * @param {function} onFileChange - Callback function for when a file is selected.
 * @param {function} onPurposeChange - Callback function for when filePurpose changes.
 * @param {string} initialPurpose - The initial value for the file purpose.
 */
export default function FileUploader({
  onFileChange,
  onPurposeChange,
  initialPurpose = "",
}) {
  const [file, setFile] = useState(null);
  const [filePurpose, setFilePurpose] = useState(initialPurpose);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile); // Pass file up
    }
  };

  const handlePurposeChange = (e) => {
    const purpose = e.target.value;
    setFilePurpose(purpose);
    onPurposeChange(purpose); // Pass purpose up
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <TextField
        label="File Purpose"
        variant="outlined"
        value={filePurpose}
        onChange={handlePurposeChange}
        required
      />
      <Button variant="contained" component="label">
        Select PDF
        <input
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {file && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Selected: {file.name}
        </Typography>
      )}
    </Box>
  );
}
