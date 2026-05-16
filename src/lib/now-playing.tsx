'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import type { NowPlayingTrack } from '@/src/types/music'
import { searchYouTube } from '@/src/lib/youtube'

interface NowPlayingState {
  track: NowPlayingTrack | null
  playing: boolean
  progress: number
  loading: boolean
  play: (title: string, artist: string, image: string) => void
  toggle: () => void
}

const NowPlayingContext = createContext<NowPlayingState | null>(null)

export function NowPlayingProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Simulated progress animation
  useEffect(() => {
    if (playing && track && !track.unavailable) {
      progressRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setPlaying(false)
            return 0
          }
          return p + 0.15
        })
      }, 50)
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [playing, track])

  const play = useCallback(async (title: string, artist: string, image: string) => {
    const trackKey = `${title}::${artist}`

    // If clicking the same track that's already loaded, just toggle
    if (track && `${track.title}::${track.artist}` === trackKey) {
      setPlaying(true)
      setProgress(0)
      return
    }

    setLoading(true)
    const yt = await searchYouTube(title, artist)
    setLoading(false)

    const newTrack: NowPlayingTrack = {
      title,
      artist,
      image,
      videoId: yt?.videoId ?? null,
      unavailable: !yt,
    }

    setTrack(newTrack)
    setPlaying(true)
    setProgress(0)
  }, [track])

  const toggle = useCallback(() => {
    setPlaying(p => !p)
  }, [])

  return (
    <NowPlayingContext.Provider value={{ track, playing, progress, loading, play, toggle }}>
      {children}
    </NowPlayingContext.Provider>
  )
}

export function useNowPlaying() {
  const ctx = useContext(NowPlayingContext)
  if (!ctx) throw new Error('useNowPlaying must be used within NowPlayingProvider')
  return ctx
}
