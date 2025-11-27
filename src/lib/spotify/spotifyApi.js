export async function fetchPlaylistTracks(playlistUrl, token) {
  if (!playlistUrl || !token) return [];

  // Extract Playlist ID from URL
  // Format: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...
  const match = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
  if (!match) return [];
  const playlistId = match[1];

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tracks");
    }

    const data = await response.json();
    return data.items.map((item) => ({
      uri: item.track.uri,
      name: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(", "),
      albumArt: item.track.album.images[2]?.url, // Smallest image
      durationMs: item.track.duration_ms,
    }));
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    return [];
  }
}
