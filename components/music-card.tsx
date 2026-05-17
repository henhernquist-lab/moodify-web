'use client'

import { useState } from 'react'
import { Play, Heart, Loader as Loader2 } from 'lucide-react'
import { useNowPlaying } from '@/src/lib/now-playing'
import { PlayingIndicator } from '@/components/playing-indicator'
import { SpotifyImage } from '@/components/spotify-image'

interface MusicCardProps {
  title: string
  artist: string
  albumColor?: string
  image?: string
  /** 'portrait' = 160×200, 'landscape' = full-width editorial */
  variant?: 'portrait' | 'landscape'
  showSaveButton?: boolean
}

export function MusicCard({
  title,
  artist,
  albumColor = '#2a1f5e',
  image,
  variant = 'portrait',
  showSaveButton = false,
}: MusicCardProps) {
  const [liked, setLiked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { track, playing, loading, play } = useNowPlaying()

  const isCurrentTrack = track?.title === title && track?.artist === artist

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    play(title, artist, image ?? '')
  }

  if (variant === 'landscape') {
    return (
      <article
        className="relative rounded-lg overflow-hidden cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${image ? '#171A22' : albumColor}dd 0%, var(--bg-card) 60%)`,
          border: '1px solid var(--border)',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hovered ? '0 0 16px rgba(124,92,255,0.18)' : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center gap-4 p-5">
          <div className="w-16 h-16 flex-shrink-0">
            <SpotifyImage src={image} alt={title} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>{title}</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{artist}</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity duration-150"
            style={{
              background: 'var(--accent)',
              color: '#ffffff',
              opacity: hovered || isCurrentTrack ? 1 : 0,
            }}
          >
            {loading && isCurrentTrack ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isCurrentTrack && playing ? (
              <PlayingIndicator />
            ) : (
              <Play size={14} className="ml-0.5" />
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className="relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
      style={{
        width: '160px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 0 16px rgba(124,92,255,0.2)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Album art area — 65% of height (approx 104px of 160px total) */}
      <div
        className="relative w-full"
        style={{ height: '104px' }}
      >
        <SpotifyImage src={image} alt={title} />
        {/* Play button overlay on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
          style={{ opacity: hovered || isCurrentTrack ? 1 : 0 }}
        >
          <button
            onClick={handlePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(124,92,255,0.9)' }}
          >
            {loading && isCurrentTrack ? (
              <Loader2 size={14} className="animate-spin" style={{ color: '#ffffff' }} />
            ) : isCurrentTrack ? (
              <PlayingIndicator />
            ) : (
              <Play size={14} style={{ color: '#ffffff' }} className="ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Track info */}
      <div className="px-3 pb-3 pt-2.5">
        <p className="font-medium text-[13px] leading-snug truncate" style={{ color: 'var(--foreground)' }}>
          {title}
        </p>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--muted)' }}>
          {artist}
        </p>

        {showSaveButton && (
          <button
            onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
            aria-label={liked ? 'Unlike' : 'Like'}
            className="absolute top-2 right-2 transition-colors duration-150"
            style={{ color: liked ? 'var(--accent)' : 'rgba(255,255,255,0.5)' }}
          >
            <Heart size={14} strokeWidth={1.5} fill={liked ? 'var(--accent)' : 'none'} />
          </button>
        )}
      </div>
    </article>
  )
}
