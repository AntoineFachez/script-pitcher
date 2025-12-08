import React, { useState } from "react";
import { useSoundtrack } from "@/context/SoundtrackContext";
import { useSpotifyPlayer } from "@/lib/spotify/useSpotifyPlayer";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, MusicNote, Save } from "@mui/icons-material";
import { useFile } from "@/context/FileContext";

export default function EditTrackList() {
  const { player, isPaused, togglePlay, nextTrack, previousTrack, setVolume } =
    useSpotifyPlayer();
  const {
    playlistUrl,
    setPlaylistUrl,
    anchors,
    removeAnchor,
    isEditing,
    setIsEditing,
    token,
    activeTrack,
    deviceId,
  } = useSoundtrack();
  const { saveSoundtrack } = useFile();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSoundtrack({ playlistUrl, anchors });
      alert("Soundtrack saved successfully!");
    } catch (error) {
      alert("Failed to save soundtrack: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <>
      {isEditing && (
        <>
          {/* <Box className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
            <Divider className="my-2" />
            <Box className="flex justify-between items-center">
              <Typography variant="caption" color="textSecondary">
                Device ID: {deviceId ? "Connected" : "Connecting..."}
              </Typography>
            </Box>
          </Box>{" "} */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Spotify Playlist URL"
              variant="outlined"
              size="small"
              fullWidth
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://open.spotify.com/playlist/..."
              helperText={
                !playlistUrl && "Paste a public Spotify playlist link"
              }
            />
          </Box>
          <Divider className="my-4" />
          <Box className="mt-4">
            <Typography variant="subtitle2" className="text-gray-500 mb-2">
              Anchors ({anchors.length})
            </Typography>

            {anchors.length === 0 ? (
              <Typography variant="body2" className="text-gray-400 italic">
                No anchors yet. Enable Edit Mode and click on a paragraph to add
                one.
              </Typography>
            ) : (
              <List dense>
                {anchors.map((anchor, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        size="small"
                        onClick={() => removeAnchor(anchor.elementId)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    }
                    sx={{
                      bgcolor: "background.default",
                      mb: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box className="flex items-center gap-1">
                          <MusicNote fontSize="inherit" color="primary" />
                          <Typography variant="body2" noWrap>
                            {anchor.trackName || "Unknown Track"}
                          </Typography>
                        </Box>
                      }
                      secondary={`Linked to: ${anchor.elementId}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>{" "}
          {/* Save Button */}
          <Box
            className="mb-4"
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleSave}
              disabled={isSaving}
              color="primary"
              title="Save Soundtrack Configuration"
              startIcon={<Save />}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
