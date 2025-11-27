import { useEffect, useState, useCallback } from "react";
import { useSoundtrack } from "@/context/SoundtrackContext";

export function useSpotifyPlayer() {
  const { token, deviceId, setDeviceId, setActiveTrack } = useSoundtrack();
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);

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
      });

      playerInstance.connect();
      setPlayer(playerInstance);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
      // Cleanup script tag if needed, though usually fine to leave
    };
  }, [token]);

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

  return { player, isReady, playTrack };
}
