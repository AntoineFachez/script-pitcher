"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  TextField,
} from "@mui/material";
import { fetchPlaylistTracks } from "@/lib/spotify/spotifyApi";
import { useSoundtrack } from "@/context/SoundtrackContext";
import CircularIndeterminate from "@/components/progress/CircularIndeterminate";

export default function TrackSelector({ open, onClose, onSelect }) {
  const { playlistUrl, token } = useSoundtrack();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open && playlistUrl && token) {
      setLoading(true);
      fetchPlaylistTracks(playlistUrl, token)
        .then(setTracks)
        .finally(() => setLoading(false));
    }
  }, [open, playlistUrl, token]);

  const filteredTracks = tracks.filter((track) =>
    track.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select a Track</DialogTitle>
      <DialogContent>
        <Box className="mb-4 mt-2">
          <TextField
            fullWidth
            size="small"
            placeholder="Search in playlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {loading ? (
          <Box className="flex justify-center p-8">
            <CircularIndeterminate color="primary" />
          </Box>
        ) : (
          <List>
            {filteredTracks.map((track) => (
              <ListItem
                button
                key={track.uri}
                onClick={() => onSelect(track)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemAvatar>
                  <Avatar src={track.albumArt} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary={track.name}
                  secondary={track.artist}
                  primaryTypographyProps={{ noWrap: true }}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
            ))}
            {filteredTracks.length === 0 && !loading && (
              <Typography className="text-center text-gray-500 py-4">
                No tracks found.
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
