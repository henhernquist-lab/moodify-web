'use client'

import { useState } from 'react'
import { Play, Pause, Plus, Check } from 'lucide-react'

interface WaveformCardProps {
  title: string
  artist: string
  duration?: string
  genre?: string
  saved?: boolean
  onSave?: () => void
  compact?: boolean
}

const BAR_HEIGHTS = [30, 55, 40, 70, 50, 80, 45, 65, 35, 75, 55, 40, 60, 80, 50, 70, 45, 35, 65, 55, 40, 75, 60, 50, 70, 45, 80, 35, 55, 65]

export function WaveformCard({
  title,
  artist,
  duration,
  genre,
  saved: initialSaved = false,
  onSave,
  compact = false,
}: WaveformCardProps) {
  const [playing, setPlaying] = useState(false)
  const [saved, setSaved] = useState(initialSaved)

  const handleSave = () => {
    setSaved(prev => !prev)
    onSave?.()
  }

  return (
    <article className="group relative rounded-lg border border-border bg-card overflow-hidden transition-colors duration-150 hover:border-accent">
      {/* Save button */}
      <button
        onClick={handleSave}
        aria-label={saved ? 'Remove from saved' : 'Save song'}
        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-accent hover:border-accent transition-colors duration-150"
      >
        {saved ? <Check size={13} /> : <Plus size={13} />}
      </button>

      <div className="p-6">
        {/* Title + artist */}
        <div className="pr-8 mb-5">
          <p className="font-semibold text-foreground text-sm leading-snug line-clamp-1">{title}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{artist}</p>
        </div>

        {/* Waveform */}
        <div className="relative h-14 flex items-end gap-[2px]">
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="wave-bar flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                backgroundColor: playing ? 'var(--accent)' : 'var(--muted-foreground)',
                animationDelay: playing ? `${i * 0.04}s` : '0s',
                animationPlayState: playing ? 'running' : 'paused',
                opacity: playing ? 1 : 0.45,
                transition: 'background-color 150ms ease, opacity 150ms ease',
              }}
            />
          ))}

          {/* Play button overlay */}
          <button
            onClick={() => setPlaying(p => !p)}
            aria-label={playing ? 'Pause' : 'Play'}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
              {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </span>
          </button>
        </div>

        {/* Meta row */}
        {(duration || genre) && (
          <div className="flex items-center justify-between mt-3">
            {genre && (
              <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
                {genre}
              </span>
            )}
            {duration && (
              <span className="text-xs text-muted-foreground ml-auto">{duration}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
