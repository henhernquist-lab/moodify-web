
import { getValidToken } from './spotify-auth';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  coverArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
  durationMs: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  image: string | null;
  spotifyUrl: string;
}

interface AudioFeatures {
  tempo: number;
  energy: number;
  valence: number;
  danceability: number;
  instrumentalness: number;
}

// Helper function for making authenticated Spotify API requests
async function spotifyFetch(endpoint: string, method: string = 'GET', body?: any, retryCount: number = 0): Promise<any> {
  const token = await getValidToken();
  if (!token) {
    // If no valid token, user needs to re-authenticate
    // In a real app, you might redirect to login or show a message
    console.error('No valid Spotify token found. Please re-authenticate.');
    // For now, we'll just return null/empty, as per requirement to not crash
    return null;
  }

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      console.error('Spotify token expired or invalid. Clearing token and prompting re-auth.');
      localStorage.removeItem('moodify_spotify_token'); // Clear invalid token
      // Optionally, trigger a re-authentication flow here
      return null; // Return null to indicate failure
    }

    if (response.status === 429) {
      // Rate limit exceeded, retry after 1 second
      if (retryCount < 3) { // Limit retries to prevent infinite loops
        console.warn('Spotify API rate limit exceeded. Retrying in 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return spotifyFetch(endpoint, method, body, retryCount + 1);
      }
      console.error('Spotify API rate limit exceeded after multiple retries.');
      return null; // Return null after max retries
    }

    if (!response.ok) {
      console.error(`Spotify API error: ${response.status} ${response.statusText}`);
      return null; // Return null on other API errors
    }

    // For PUT requests that return 204 No Content, we don't parse JSON
    if (response.status === 204) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Network or unexpected error during Spotify API call:', error);
    return null; // Return null on network errors
  }
}

function mapSpotifyTrackToAppTrack(item: any): SpotifyTrack {
  return {
    id: item.id,
    name: item.name,
    artist: item.artists[0]?.name || 'Unknown Artist',
    album: item.album?.name || 'Unknown Album',
    coverArt: item.album?.images[1]?.url || null,
    previewUrl: item.preview_url,
    spotifyUrl: item.external_urls?.spotify,
    durationMs: item.duration_ms,
  };
}

export async function searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
  if (!query) return [];
  const data = await spotifyFetch(`/search?type=track&q=${encodeURIComponent(query)}&limit=${limit}`);
  if (data && data.tracks && data.tracks.items) {
    return data.tracks.items.map(mapSpotifyTrackToAppTrack);
  }
  return [];
}

export async function getSimilarTracks(seedTrackId: string, seedArtistId: string, targetMood: string): Promise<SpotifyTrack[]> {
  if (!seedTrackId || !seedArtistId || !targetMood) return [];

  let params: Record<string, any> = {
    seed_tracks: seedTrackId,
    seed_artists: seedArtistId,
    limit: 10,
  };

  switch (targetMood.toLowerCase()) {
    case 'melancholic':
      params = { ...params, target_valence: 0.2, min_valence: 0.1, max_valence: 0.3, target_energy: 0.3, min_energy: 0.2, max_energy: 0.4 };
      break;
    case 'energetic':
      params = { ...params, target_valence: 0.75, min_valence: 0.6, max_valence: 0.9, target_energy: 0.85, min_energy: 0.7, max_energy: 1.0 };
      break;
    case 'focused':
      params = { ...params, target_valence: 0.5, min_valence: 0.4, max_valence: 0.6, target_energy: 0.5, min_energy: 0.4, max_energy: 0.6, target_instrumentalness: 0.75, min_instrumentalness: 0.5 };
      break;
    case 'euphoric':
      params = { ...params, target_valence: 0.9, min_valence: 0.8, max_valence: 1.0, target_energy: 0.9, min_energy: 0.8, max_energy: 1.0 };
      break;
    case 'peaceful':
      params = { ...params, target_valence: 0.6, min_valence: 0.5, max_valence: 0.7, target_energy: 0.2, min_energy: 0.1, max_energy: 0.3 };
      break;
    default:
      console.warn(`Unknown mood: ${targetMood}. Using default recommendations.`);
      break;
  }

  const queryString = new URLSearchParams(params).toString();
  const data = await spotifyFetch(`/recommendations?${queryString}`);

  if (data && data.tracks) {
    return data.tracks.map(mapSpotifyTrackToAppTrack);
  }
  return [];
}

export async function getUserTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch(`/me/top/tracks?time_range=${timeRange}&limit=10`);
  if (data && data.items) {
    return data.items.map(mapSpotifyTrackToAppTrack);
  }
  return [];
}

export async function getUserTopArtists(): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch(`/me/top/artists?limit=10`);
  if (data && data.items) {
    return data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.images[1]?.url || null,
      spotifyUrl: item.external_urls?.spotify,
    }));
  }
  return [];
}

export async function saveTrack(trackId: string): Promise<boolean> {
  if (!trackId) return false;
  const response = await spotifyFetch(`/me/tracks?ids=${trackId}`, 'PUT');
  return response !== null; // If response is not null, it means the request was successful (even if 204 No Content)
}

export async function getTrackAudioFeatures(trackId: string): Promise<AudioFeatures | null> {
  if (!trackId) return null;
  const data = await spotifyFetch(`/audio-features/${trackId}`);
  if (data) {
    return {
      tempo: data.tempo,
      energy: data.energy,
      valence: data.valence,
      danceability: data.danceability,
      instrumentalness: data.instrumentalness,
    };
  }
  return null;
}
