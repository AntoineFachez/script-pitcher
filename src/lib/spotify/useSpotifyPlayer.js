import { useEffect, useState, useCallback } from "react";
import { useSoundtrack } from "@/context/SoundtrackContext";

export function useSpotifyPlayer() {
  const { token, deviceId, player, isReady, isPaused } = useSoundtrack();

  const playTrack = useCallback(
    async (trackUri, deviceIdOverride) => {
      const activeDevice = deviceIdOverride || deviceId;

      if (!token || !activeDevice) {
        console.warn("Cannot play: Missing token or deviceId");
        return;
      }

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${activeDevice}`,
          {
            method: "PUT",
            body: JSON.stringify({ uris: [trackUri] }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Spotify Play Error:", response.status, errorData);
        }
      } catch (e) {
        console.error("Error playing track:", e);
      }
    },
    [token, deviceId]
  );

  const togglePlay = useCallback(() => {
    player?.togglePlay();
  }, [player]);

  const nextTrack = useCallback(() => {
    player?.nextTrack();
  }, [player]);

  const previousTrack = useCallback(() => {
    player?.previousTrack();
  }, [player]);

  const setVolume = useCallback(
    (val) => {
      player?.setVolume(val);
    },
    [player]
  );

  return {
    player,
    isReady,
    isPaused,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
  };
}
