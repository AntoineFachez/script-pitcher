"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { exchangeToken } from "@/lib/spotify/pkce";
import { useSoundtrack, SoundtrackProvider } from "@/context/SoundtrackContext";

// Must match the one in SpotifyAuth.js
const CLIENT_ID = "5521a55ea17847159d7ef2ec595f1002";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useSoundtrack();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const storedVerifier = localStorage.getItem("spotify_code_verifier");
    const returnUrl = localStorage.getItem("spotify_return_url") || "/";

    if (errorParam) {
      setError(`Spotify Auth Error: ${errorParam}`);
      return;
    }

    if (code && storedVerifier) {
      const redirectUri = `${window.location.origin}/callback`;

      exchangeToken(code, CLIENT_ID, redirectUri, storedVerifier)
        .then((data) => {
          setToken(data.access_token);
          // Store token in localStorage for persistence
          localStorage.setItem("spotify_access_token", data.access_token);
          // Clean up
          localStorage.removeItem("spotify_code_verifier");
          localStorage.removeItem("spotify_return_url");

          // Redirect back
          router.push(returnUrl);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
        });
    } else if (!code) {
      setError("No authorization code found.");
    }
  }, [searchParams, router, setToken]);

  if (error) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-screen p-4">
        <Typography color="error" variant="h6">
          Authentication Failed
        </Typography>
        <Typography color="textSecondary">{error}</Typography>
        <Typography
          className="mt-4 text-blue-500 cursor-pointer hover:underline"
          onClick={() => router.push("/")}
        >
          Return Home
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen">
      <CircularProgress />
      <Typography className="mt-4 text-gray-500">
        Connecting to Spotify...
      </Typography>
    </Box>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <SoundtrackProvider>
        <CallbackContent />
      </SoundtrackProvider>
    </Suspense>
  );
}
