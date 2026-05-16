// Last.fm API client
// Docs: https://www.last.fm/api/

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0'

export interface TrackInfo {
  name: string
  artist: string
  tags: string[]
  image?: string
  url?: string
}

export interface SimilarTrack {
  name: string
  artist: string
  image?: string
  url?: string
  playcount?: number
  match?: number
}

export interface SearchResult {
  name: string
  artist: string
  image?: string
}

/**
 * Search for a track by name and optionally artist
 */
export async function searchTrack(
  trackName: string,
  artistName?: string
): Promise<SearchResult[]> {
  if (!LASTFM_API_KEY) {
    console.error('[v0] NEXT_PUBLIC_LASTFM_API_KEY not set')
    return []
  }

  try {
    const params = new URLSearchParams({
      method: 'track.search',
      track: trackName,
      ...(artistName && { artist: artistName }),
      api_key: LASTFM_API_KEY,
      format: 'json',
      limit: '5',
    })

    const response = await fetch(`${LASTFM_API_URL}?${params}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[v0] Last.fm search failed:', response.statusText)
      return []
    }

    const data = await response.json()

    if (!data.results?.trackmatches?.track) {
      return []
    }

    const tracks = Array.isArray(data.results.trackmatches.track)
      ? data.results.trackmatches.track
      : [data.results.trackmatches.track]

    return tracks.map((track: any) => ({
      name: track.name,
      artist: track.artist,
      image: track.image?.[2]?.['#text'], // index 2 = medium size
    }))
  } catch (err) {
    console.error('[v0] Last.fm search error:', err)
    return []
  }
}

/**
 * Get track info including tags/genres
 */
export async function getTrackInfo(trackName: string, artistName: string): Promise<TrackInfo | null> {
  if (!LASTFM_API_KEY) {
    console.error('[v0] NEXT_PUBLIC_LASTFM_API_KEY not set')
    return null
  }

  try {
    const params = new URLSearchParams({
      method: 'track.getInfo',
      track: trackName,
      artist: artistName,
      api_key: LASTFM_API_KEY,
      format: 'json',
    })

    const response = await fetch(`${LASTFM_API_URL}?${params}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[v0] Last.fm getTrackInfo failed:', response.statusText)
      return null
    }

    const data = await response.json()

    if (!data.track) {
      return null
    }

    const tags = data.track.tags?.tag
      ? (Array.isArray(data.track.tags.tag) ? data.track.tags.tag : [data.track.tags.tag]).map(
          (t: any) => t.name
        )
      : []

    return {
      name: data.track.name,
      artist: data.track.artist?.name || '',
      tags,
      image: data.track.image?.[2]?.['#text'],
      url: data.track.url,
    }
  } catch (err) {
    console.error('[v0] Last.fm getTrackInfo error:', err)
    return null
  }
}

/**
 * Get similar tracks for a given track
 */
export async function getSimilarTracks(
  trackName: string,
  artistName: string,
  limit: number = 9
): Promise<SimilarTrack[]> {
  if (!LASTFM_API_KEY) {
    console.error('[v0] NEXT_PUBLIC_LASTFM_API_KEY not set')
    return []
  }

  try {
    const params = new URLSearchParams({
      method: 'track.getSimilar',
      track: trackName,
      artist: artistName,
      api_key: LASTFM_API_KEY,
      format: 'json',
      limit: String(limit),
    })

    const response = await fetch(`${LASTFM_API_URL}?${params}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[v0] Last.fm getSimilarTracks failed:', response.statusText)
      return []
    }

    const data = await response.json()

    if (!data.similartracks?.track) {
      return []
    }

    const tracks = Array.isArray(data.similartracks.track)
      ? data.similartracks.track
      : [data.similartracks.track]

    return tracks.map((track: any) => ({
      name: track.name,
      artist: track.artist?.name || '',
      image: track.image?.[2]?.['#text'],
      url: track.url,
      match: track.match ? parseFloat(track.match) : undefined,
    }))
  } catch (err) {
    console.error('[v0] Last.fm getSimilarTracks error:', err)
    return []
  }
}

/**
 * Map Last.fm tags to mood pills
 */
export function mapTagsToMoods(tags: string[]): string[] {
  const tagLower = tags.map(t => t.toLowerCase())
  
  const moodMap: Record<string, string> = {
    // Melancholic
    sad: 'Melancholic',
    melancholic: 'Melancholic',
    depressing: 'Melancholic',
    emotional: 'Melancholic',
    blues: 'Melancholic',
    
    // Peaceful
    chill: 'Peaceful',
    peaceful: 'Peaceful',
    calm: 'Peaceful',
    relaxing: 'Peaceful',
    ambient: 'Peaceful',
    mellow: 'Peaceful',
    
    // Energetic
    energetic: 'Energetic',
    uplifting: 'Energetic',
    electronic: 'Energetic',
    dance: 'Energetic',
    upbeat: 'Energetic',
    fast: 'Energetic',
    
    // Euphoric
    euphoric: 'Euphoric',
    happy: 'Euphoric',
    joyful: 'Euphoric',
    feel-good: 'Euphoric',
    
    // Nostalgic
    nostalgic: 'Nostalgic',
    retro: 'Nostalgic',
    vintage: 'Nostalgic',
    classic: 'Nostalgic',
    
    // Dark
    dark: 'Dark',
    aggressive: 'Dark',
    intense: 'Dark',
    heavy: 'Dark',
    gothic: 'Dark',
    
    // Focused
    focused: 'Focused',
    study: 'Focused',
    work: 'Focused',
    instrumental: 'Focused',
    atmospheric: 'Focused',
    
    // Rebellious
    rebellious: 'Rebellious',
    punk: 'Rebellious',
    rock: 'Rebellious',
    metal: 'Rebellious',
    edgy: 'Rebellious',
  }
  
  const matched = new Set<string>()
  for (const tag of tagLower) {
    const mood = moodMap[tag]
    if (mood) matched.add(mood)
  }
  
  return Array.from(matched)
}
