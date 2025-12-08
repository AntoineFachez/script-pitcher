"use client";

import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import SpotifyAuth from "@/lib/spotify/SpotifyAuth";
import Controls from "./Controls";
import EditTrackList from "./EditTrackList";
import { useSoundtrack } from "@/context/SoundtrackContext";
import { useState } from "react";
import { List } from "@mui/icons-material";

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
        zIndex: 1200,
        right: 20,
        top: 80,
        width: "fit-content",
        maxWidth: isEditing ? "400px" : "200px",
        maxHeight: "80vh",
        overflowY: "auto",
        p: 1,
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
      }}
    >
      {!deviceId && <SpotifyAuth />}
      {deviceId && (
        <>
          <Box sx={{ width: "100%", height: "auto", p: 0, m: 0 }}>
            {activeTrack && (
              <img
                src={activeTrack?.album?.images?.[0]?.url}
                alt=" Waiting for playback..."
                className="w-10 h-10 rounded shadow-sm"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "5px 5px 0 0",
                  p: 0,
                  m: 0,
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
          <Controls />
          <EditTrackList />
        </>
      )}
    </Paper>
  );
}
