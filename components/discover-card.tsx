'use client'

import { useState } from 'react'
import { Play, Heart, Loader as Loader2 } from 'lucide-react'
import { useNowPlaying } from '@/src/lib/now-playing'
import { PlayingIndicator } from '@/components/playing-indicator'

interface DiscoverCardProps {
  title: string
  artist: string
  albumColor?: string
  genre?: string
  image?: string
}

export function DiscoverCard({ title, artist, albumColor = '#1a1a3a', genre, image }: DiscoverCardProps) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const { track, loading, play } = useNowPlaying()

  const isCurrentTrack = track?.title === title && track?.artist === artist

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    play(title, artist, image ?? '')
  }

  return (
    <article
      className="relative rounded-lg overflow-hidden cursor-pointer"
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
      {/* Album art — taller, editorial feel */}
      <div
        className="relative w-full"
        style={{ height: '140px', background: albumColor }}
        aria-hidden="true"
      >
        {genre && (
          <span
            className="absolute top-3 left-3 text-[10px] font-medium px-2 py-0.5 rounded"
            style={{ background: 'rgba(11,11,15,0.6)', color: 'var(--muted)' }}
          >
            {genre}
          </span>
        )}

        {/* Play overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
          style={{ opacity: hovered || isCurrentTrack ? 1 : 0 }}
        >
          <button
            onClick={handlePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(124,92,255,0.9)' }}
          >
            {loading && isCurrentTrack ? (
              <Loader2 size={16} className="animate-spin" style={{ color: '#ffffff' }} />
            ) : isCurrentTrack ? (
              <PlayingIndicator />
            ) : (
              <Play size={16} style={{ color: '#ffffff' }} className="ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Track info */}
      <div className="px-4 py-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>{title}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{artist}</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
          aria-label={liked ? 'Unlike' : 'Like'}
          className="flex-shrink-0 transition-colors duration-150 pt-0.5"
          style={{ color: liked ? 'var(--accent)' : 'var(--muted)' }}
        >
          <Heart size={15} strokeWidth={1.5} fill={liked ? 'var(--accent)' : 'none'} />
        </button>
      </div>
    </article>
  )
}
