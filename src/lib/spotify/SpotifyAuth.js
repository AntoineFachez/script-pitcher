"use client";

import { useEffect } from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import { useSoundtrack } from "@/context/SoundtrackContext";
import {
  generateRandomString,
  generateCodeChallenge,
} from "@/lib/spotify/pkce";
import SpotifyButton from "./SpotifyButton";

// Replace with your actual Client ID from Spotify Dashboard
const CLIENT_ID = "5521a55ea17847159d7ef2ec595f1002";
const REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/callback` // Match the user's configured URI
    : "";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
];

export default function SpotifyAuth() {
  const { token, setToken } = useSoundtrack();

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, [token, setToken]);

  const handleLogin = async () => {
    if (CLIENT_ID === "YOUR_SPOTIFY_CLIENT_ID") {
      alert(
        "Please configure your Spotify Client ID in src/lib/spotify/SpotifyAuth.js"
      );
      return;
    }

    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("spotify_code_verifier", codeVerifier);
    localStorage.setItem("spotify_return_url", window.location.href);

    const args = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPES.join(" "),
      redirect_uri: REDIRECT_URI,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location.href = `${AUTH_ENDPOINT}?${args}`;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setToken(null);
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    // Optional: Only clear spotify related items
    localStorage.removeItem("spotify_code_verifier");
    localStorage.removeItem("spotify_return_url");
    window.location.reload();
  };

  if (token) {
    return <SpotifyButton onClick={handleLogout} />;
  }

  return (
    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={handleLogin}
      sx={{ textTransform: "none", borderRadius: 20 }}
    >
      Connect Spotify
    </Button>
  );
}
