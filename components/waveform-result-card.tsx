'use client'

import { useState } from 'react'
import { Play, Pause, Plus, Check, Loader as Loader2 } from 'lucide-react'
import { useNowPlaying } from '@/src/lib/now-playing'
import { PlayingIndicator } from '@/components/playing-indicator'
import { SpotifyImage } from '@/components/spotify-image'

interface WaveformResultCardProps {
  title: string
  artist: string
  duration?: string
  genre?: string
  image?: string
}

// 30 bar heights for the waveform
const BARS = [28, 52, 38, 68, 44, 76, 42, 62, 30, 72, 54, 38, 58, 80, 48, 66, 40, 32, 60, 52, 38, 70, 56, 46, 68, 42, 78, 32, 52, 62]

export function WaveformResultCard({ title, artist, duration, genre, image }: WaveformResultCardProps) {
  const [saved, setSaved] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { track, playing, loading, play, toggle } = useNowPlaying()

  const isCurrentTrack = track?.title === title && track?.artist === artist
  const isActive = isCurrentTrack && playing

  const handlePlay = () => {
    if (isCurrentTrack) {
      toggle()
    } else {
      play(title, artist, image ?? '')
    }
  }

  return (
    <article
      className="relative rounded-lg overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 0 16px rgba(124,92,255,0.2)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="p-5 flex gap-4">
        {/* Album Art */}
        <div className="w-16 h-16 flex-shrink-0">
          <SpotifyImage src={image} alt={title} />
        </div>

        <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-snug truncate" style={{ color: 'var(--foreground)' }}>
              {title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{artist}</p>
          </div>
          <button
            onClick={() => setSaved(s => !s)}
            aria-label={saved ? 'Remove from library' : 'Save to library'}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-150"
            style={{
              background: saved ? 'rgba(124,92,255,0.15)' : 'transparent',
              color:      saved ? 'var(--accent)' : 'var(--muted)',
              border:     `1px solid ${saved ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {saved ? <Check size={12} /> : <Plus size={12} />}
          </button>
        </div>

        {/* Waveform + play button */}
        <div className="relative h-14 flex items-end gap-[2px] group/wave">
          {BARS.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm wave-bar ${hovered || isActive ? 'wave-bar-fast' : ''}`}
              style={{
                height: `${h}%`,
                backgroundColor: isActive ? 'var(--accent)' : 'rgba(124,92,255,0.35)',
                animationDelay: `${i * 0.038}s`,
                animationPlayState: isActive ? 'running' : (hovered ? 'running' : 'paused'),
                transition: 'background-color 150ms ease',
              }}
            />
          ))}

          {/* Play button */}
          <button
            onClick={handlePlay}
            aria-label={isActive ? 'Pause' : 'Play'}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
            style={{ opacity: hovered || isActive ? 1 : 0 }}
          >
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 0 12px rgba(124,92,255,0.3)',
              }}
            >
              {loading && isCurrentTrack ? (
                <Loader2 size={14} className="animate-spin" style={{ color: '#ffffff' }} />
              ) : isActive ? (
                <Pause size={14} style={{ color: '#ffffff' }} />
              ) : isCurrentTrack ? (
                <PlayingIndicator />
              ) : (
                <Play size={14} style={{ color: '#ffffff' }} className="ml-0.5" />
              )}
            </span>
          </button>
        </div>

        {/* Meta */}
        {(duration || genre) && (
          <div className="flex items-center justify-between mt-3">
            {genre && (
              <span
                className="text-[11px] px-2 py-0.5 rounded"
                style={{ background: 'rgba(124,92,255,0.1)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                {genre}
              </span>
            )}
            {duration && (
              <span className="text-[11px] ml-auto" style={{ color: 'var(--muted)' }}>{duration}</span>
            )}
          </div>
        )}
        </div>
      </div>
    </article>
  )
}
