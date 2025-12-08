"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SoundtrackContext = createContext();

export function SoundtrackProvider({ children, initialData }) {
  const [playlistUrl, setPlaylistUrl] = useState(
    initialData?.playlistUrl || ""
  );
  const [anchors, setAnchors] = useState(initialData?.anchors || []);
  const [token, setToken] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTrack, setActiveTrack] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Load saved configuration (mock persistence for now, could be localStorage or DB)
  useEffect(() => {
    const savedConfig = localStorage.getItem(
      "script_pitcher_soundtrack_config"
    );
    if (savedConfig && !initialData) {
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

  useEffect(() => {
    if (initialData) {
      setPlaylistUrl(initialData.playlistUrl || "");
      setAnchors(initialData.anchors || []);
    }
  }, [initialData]);

  // Save configuration whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "script_pitcher_soundtrack_config",
      JSON.stringify({ playlistUrl, anchors })
    );
  }, [playlistUrl, anchors]);

  // Initializing the Spotify Player here to ensure a singleton instance
  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: "Script Pitcher Soundtrack",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      playerInstance.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      playerInstance.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setDeviceId(null);
        setIsReady(false);
      });

      playerInstance.addListener("player_state_changed", (state) => {
        if (!state) return;
        setActiveTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      playerInstance.connect();
      setPlayer(playerInstance);
    };

    return () => {
      // We generally don't disconnect on unmount of the provider unless the app is closing
      // But clearing the player state is good practice if token changes
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

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
    player,
    isPaused,
    isReady,
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
