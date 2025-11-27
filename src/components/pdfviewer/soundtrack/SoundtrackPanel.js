"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useSoundtrack } from "@/context/SoundtrackContext";
import SpotifyAuth from "@/lib/spotify/SpotifyAuth";

export default function SoundtrackPanel() {
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

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        right: 20,
        top: 80,
        width: 300,
        maxHeight: "80vh",
        overflowY: "auto",
        zIndex: 1200,
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-bold">
          Soundtrack
        </Typography>
        <SpotifyAuth />
      </Box>

      {token && (
        <>
          <Box className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
            <Typography variant="subtitle2" className="font-bold mb-1">
              Now Playing
            </Typography>
            {activeTrack ? (
              <Box className="flex items-center gap-2">
                {activeTrack.album?.images?.[0]?.url && (
                  <img
                    src={activeTrack.album.images[0].url}
                    alt="Album Art"
                    className="w-10 h-10 rounded shadow-sm"
                  />
                )}
                <Box className="overflow-hidden">
                  <Typography variant="body2" className="font-medium truncate">
                    {activeTrack.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-gray-600 truncate block"
                  >
                    {activeTrack.artists?.[0]?.name}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" className="text-gray-500 italic">
                Waiting for playback...
              </Typography>
            )}
            <Divider className="my-2" />
            <Box className="flex justify-between items-center">
              <Typography variant="caption" color="textSecondary">
                Device ID: {deviceId ? "Connected" : "Connecting..."}
              </Typography>
            </Box>
          </Box>

          <Box className="mb-4">
            <TextField
              label="Spotify Playlist URL"
              variant="outlined"
              size="small"
              fullWidth
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://open.spotify.com/playlist/..."
              helperText="Paste a public Spotify playlist link"
            />
          </Box>

          <Divider className="my-4" />

          <FormControlLabel
            control={
              <Switch
                checked={isEditing}
                onChange={(e) => setIsEditing(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" className="font-medium">
                Edit Mode (Click text to anchor)
              </Typography>
            }
          />

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
                        <DeleteIcon fontSize="small" />
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
                          <MusicNoteIcon fontSize="inherit" color="primary" />
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
          </Box>
        </>
      )}
    </Paper>
  );
}
