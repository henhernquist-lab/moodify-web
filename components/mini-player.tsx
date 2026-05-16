'use client'

import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, ListMusic } from 'lucide-react'
import { useNowPlaying } from '@/src/lib/now-playing'

export function MiniPlayer() {
  const { track, playing, progress, toggle } = useNowPlaying()
  const [liked, setLiked] = useState(false)
  const [volume, setVolume] = useState(70)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:left-[220px]"
      style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--border)' }}
    >
      {/* Progress bar — very top of player */}
      <div className="px-0">
        <input
          type="range"
          className="progress-bar w-full block"
          min={0}
          max={100}
          value={progress}
          onChange={e => {/* real audio later */}}
          aria-label="Song progress"
          style={{
            background: `linear-gradient(to right, var(--accent) ${progress}%, var(--border) ${progress}%)`,
          }}
        />
      </div>

      {/* Player body */}
      <div className="flex items-center h-16 px-4 gap-4 lg:h-[72px] lg:px-6">

        {/* Left — track info */}
        <div className="flex items-center gap-3 min-w-0 flex-1 lg:flex-none lg:w-64">
          {track ? (
            <>
              {track.image ? (
                <img
                  src={track.image}
                  alt=""
                  className="w-10 h-10 rounded flex-shrink-0 object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded flex-shrink-0"
                  style={{ background: 'var(--bg-card)' }}
                  aria-hidden="true"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                  {track.title}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                  {track.artist}
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-10 h-10 rounded flex-shrink-0"
                style={{ background: 'var(--bg-card)' }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--muted)' }}>
                  Not playing
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                  Pick a song to start
                </p>
              </div>
            </>
          )}
        </div>

        {/* Center — controls (hidden on mobile except play) */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-5">
          <button
            aria-label="Previous track"
            className="transition-colors duration-150 hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            <SkipBack size={16} strokeWidth={1.5} />
          </button>

          <button
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-105"
            style={{
              background: 'var(--accent)',
              color: '#ffffff',
              boxShadow: playing ? '0 0 12px rgba(124,92,255,0.25)' : 'none',
            }}
          >
            {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>

          <button
            aria-label="Next track"
            className="transition-colors duration-150 hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            <SkipForward size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile-only play button */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent)', color: '#ffffff' }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>

        {/* Right — heart + volume + queue */}
        <div className="flex items-center gap-3 lg:w-64 lg:justify-end">
          <button
            onClick={() => setLiked(l => !l)}
            aria-label={liked ? 'Unlike' : 'Like'}
            className="transition-colors duration-150"
            style={{ color: liked ? 'var(--accent)' : 'var(--muted)' }}
          >
            <Heart size={16} strokeWidth={1.5} fill={liked ? 'var(--accent)' : 'none'} />
          </button>

          {/* Volume — desktop only */}
          <div className="hidden lg:flex items-center gap-2">
            <Volume2 size={14} strokeWidth={1.5} style={{ color: 'var(--muted)' }} />
            <input
              type="range"
              className="volume-slider w-20"
              min={0}
              max={100}
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              aria-label="Volume"
              style={{
                background: `linear-gradient(to right, var(--accent) ${volume}%, var(--border) ${volume}%)`,
              }}
            />
          </div>

          <button
            aria-label="Queue"
            className="hidden lg:block transition-colors duration-150 hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            <ListMusic size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile nav safe area spacer */}
      <div className="lg:hidden h-14" />
    </div>
  )
}
