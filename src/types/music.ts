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
