import React, { useState, useEffect } from "react";
import {
  Box,
  Slider,
  IconButton,
  Typography,
  Divider,
  TextField,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  VolumeUp,
  VolumeDown,
  List,
} from "@mui/icons-material";
import { useSpotifyPlayer } from "@/lib/spotify/useSpotifyPlayer";
import { useSoundtrack } from "@/context/SoundtrackContext";
import SpotifyAuth from "@/lib/spotify/SpotifyAuth";

export default function Controls() {
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
  const [localVolume, setLocalVolume] = useState(15);

  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (player) {
      player.getVolume().then((volume) => {
        setLocalVolume(volume * 100);
      });
    }
  }, [player]);

  const handleVolumeChange = (event, newValue) => {
    setLocalVolume(newValue);
    setVolume(newValue / 100);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column wrap",
        alignItems: "center",
        justifyContent: "center",
        p: "0 8px",
        borderRadius: "0px 0 5px 5px",
        boxShadow: 1,
        backgroundColor: "background.paper",
      }}
    >
      {token && (
        <>
          {" "}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 0,
            }}
          >
            {" "}
            <SpotifyAuth />
            {/* <IconButton onClick={previousTrack}>
              <SkipPrevious />
            </IconButton> */}
            <IconButton
              onClick={togglePlay}
              color="primary"
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                width: 36,
                height: 36,
              }}
            >
              {isPaused ? <PlayArrow /> : <Pause />}
            </IconButton>
            {/* <IconButton onClick={nextTrack}>
              <SkipNext />
            </IconButton> */}
            <IconButton onClick={() => setIsEditing(!isEditing)}>
              <List />
            </IconButton>{" "}
          </Box>
          {/* <Box
            className="flex justify-between items-center mb-4"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          ></Box>{" "} */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 1,
            }}
          >
            <VolumeDown color="action" fontSize="small" />
            <Slider
              size="small"
              value={localVolume}
              onChange={handleVolumeChange}
              aria-label="Volume"
            />
            <VolumeUp color="action" fontSize="small" />
          </Box>
          {/* <Box>
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
                    style={{ width: "40px", height: "40px" }}
                  />
                )}
                  <Box className="overflow-hidden">
                    <Typography
                      variant="body2"
                      className="font-medium truncate"
                    >
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
            </Box>
          </Box> */}
        </>
      )}
    </Box>
  );
}
