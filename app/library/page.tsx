'use client'

import { useState } from 'react'
import { Music2, ListMusic, Heart } from 'lucide-react'
import { MusicCard } from '@/components/music-card'

const SAVED_SONGS = [
  { title: 'Self Control',          artist: 'Frank Ocean',       duration: '4:12', albumColor: '#1a2e2e' },
  { title: 'Liability',             artist: 'Lorde',             duration: '3:57', albumColor: '#1a1a3a' },
  { title: 'Slow Burn',             artist: 'Kacey Musgraves',   duration: '3:40', albumColor: '#2a3a1e' },
  { title: 'Retrograde',            artist: 'James Blake',       duration: '4:10', albumColor: '#1a1e3a' },
  { title: 'Motion Sickness',       artist: 'Phoebe Bridgers',   duration: '3:35', albumColor: '#2a1e2e' },
  { title: 'Holocene',              artist: 'Bon Iver',          duration: '5:37', albumColor: '#1e1e2e' },
  { title: 'Skinny Love',           artist: 'Bon Iver',          duration: '3:58', albumColor: '#2e1e1e' },
  { title: 'Pink + White',          artist: 'Frank Ocean',       duration: '3:04', albumColor: '#2e2040' },
]

const PLAYLISTS = [
  { title: 'Late Night Drive',   artist: '24 songs', albumColor: '#1a1a3e' },
  { title: 'Melancholic Mondays',artist: '18 songs', albumColor: '#2a1a2e' },
  { title: 'Focus State',        artist: '31 songs', albumColor: '#0e2a2a' },
  { title: 'Sunday Mornings',    artist: '22 songs', albumColor: '#2a2a1a' },
  { title: 'Running Playlist',   artist: '17 songs', albumColor: '#2a1a1a' },
  { title: 'Chill Bedroom Vibes',artist: '28 songs', albumColor: '#1a2a1a' },
]

type Tab = 'saved' | 'playlists'

export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>('saved')

  return (
    <div className="px-6 py-8 lg:px-8 lg:py-10 max-w-[1200px]">

      {/* Header */}
      <header className="mb-8">
        <h1
          className="text-3xl lg:text-4xl font-semibold tracking-tight"
          style={{ color: 'var(--foreground)', lineHeight: 1.2 }}
        >
          Your Library
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-0 mb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        {(['saved', 'playlists'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-4 pb-3 text-sm font-medium transition-colors duration-150 capitalize"
            style={{ color: tab === t ? 'var(--foreground)' : 'var(--muted)' }}
            aria-selected={tab === t}
            role="tab"
          >
            {t === 'saved' ? 'Saved Songs' : 'Playlists'}
            {tab === t && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Saved Songs — list layout */}
      {tab === 'saved' && (
        SAVED_SONGS.length === 0 ? (
          <EmptyState
            icon={<Heart size={28} strokeWidth={1.5} />}
            message="No saved songs yet."
            cta="Start exploring"
            href="/mood-search"
          />
        ) : (
          <ul className="flex flex-col" aria-label="Saved songs">
            {SAVED_SONGS.map((song, i) => (
              <li
                key={song.title}
                className="flex items-center gap-4 px-3 py-3 rounded-lg transition-colors duration-100 cursor-pointer"
                style={{ borderBottom: i < SAVED_SONGS.length - 1 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  className="w-12 h-12 rounded flex-shrink-0"
                  style={{ background: song.albumColor }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                    {song.title}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>
                    {song.artist}
                  </p>
                </div>
                <span className="text-xs tabular-nums flex-shrink-0" style={{ color: 'var(--muted)' }}>
                  {song.duration}
                </span>
              </li>
            ))}
          </ul>
        )
      )}

      {/* Playlists — grid */}
      {tab === 'playlists' && (
        PLAYLISTS.length === 0 ? (
          <EmptyState
            icon={<ListMusic size={28} strokeWidth={1.5} />}
            message="No playlists yet."
            cta="Create a playlist"
            href="#"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PLAYLISTS.map(pl => (
              <MusicCard key={pl.title} title={pl.title} artist={pl.artist} albumColor={pl.albumColor} />
            ))}
          </div>
        )
      )}

    </div>
  )
}

function EmptyState({
  icon, message, cta, href,
}: {
  icon: React.ReactNode
  message: string
  cta: string
  href: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>{message}</p>
      <a href={href} className="text-sm transition-colors duration-150 hover:opacity-80" style={{ color: 'var(--accent)' }}>
        {cta}
      </a>
    </div>
  )
}
