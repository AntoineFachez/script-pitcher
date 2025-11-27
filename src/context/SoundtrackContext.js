"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SoundtrackContext = createContext();

export function SoundtrackProvider({ children }) {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [anchors, setAnchors] = useState([]);
  const [token, setToken] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTrack, setActiveTrack] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // Load saved configuration (mock persistence for now, could be localStorage or DB)
  useEffect(() => {
    const savedConfig = localStorage.getItem(
      "script_pitcher_soundtrack_config"
    );
    if (savedConfig) {
      const { playlistUrl, anchors } = JSON.parse(savedConfig);
      setPlaylistUrl(playlistUrl || "");
      setAnchors(anchors || []);
    }

    // Also load token
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Save configuration whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "script_pitcher_soundtrack_config",
      JSON.stringify({ playlistUrl, anchors })
    );
  }, [playlistUrl, anchors]);

  const addAnchor = (anchor) => {
    setAnchors((prev) => {
      // Remove existing anchor for this element if it exists
      const filtered = prev.filter((a) => a.elementId !== anchor.elementId);
      return [...filtered, anchor];
    });
  };

  const removeAnchor = (elementId) => {
    setAnchors((prev) => prev.filter((a) => a.elementId !== elementId));
  };

  const value = {
    playlistUrl,
    setPlaylistUrl,
    anchors,
    setAnchors,
    addAnchor,
    removeAnchor,
    token,
    setToken,
    isEditing,
    setIsEditing,
    activeTrack,
    setActiveTrack,
    deviceId,
    setDeviceId,
  };

  return (
    <SoundtrackContext.Provider value={value}>
      {children}
    </SoundtrackContext.Provider>
  );
}

export function useSoundtrack() {
  return useContext(SoundtrackContext);
}
