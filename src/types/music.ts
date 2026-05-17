export interface SimilarTrack {
  name: string
  artist: string
  image: string
  match: number
  url: string
}

export interface TrackSuggestion {
  name: string
  artist: string
  url: string
}

export interface TrackInfo {
  name: string
  artist: string
  album: string
  image: string
  tags: string[]
  duration: number
}

export interface TrackTag {
  name: string
  url: string
}

export interface YouTubeResult {
  videoId: string
  title: string
  thumbnail: string
}

export interface NowPlayingTrack {
  title: string
  artist: string
  image: string | null
  videoId: string | null
  unavailable: boolean
}

export interface MoodPlaylistTrack {
  name: string
  artist: string
  image: string | null
  duration: string
}

export interface MoodPlaylist {
  name: string
  mood: string
  energy: string
  intensity: number
  tracks: MoodPlaylistTrack[]
  createdAt: string
}
