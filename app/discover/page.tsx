'use client'

import { useState } from 'react'
import { DiscoverCard } from '@/components/discover-card'

const MOOD_FILTERS = [
  'Chill', 'Focus', 'Hype', 'Melancholic',
  'Late Night', 'Workout', 'Euphoric', 'Nostalgic',
]

const DISCOVER_TRACKS = [
  { title: 'Ivy',                  artist: 'Frank Ocean',          albumColor: '#1a2e1a', genre: 'R&B' },
  { title: 'Cigarette Daydreams', artist: 'Cage the Elephant',    albumColor: '#2e1a1a', genre: 'Indie Rock' },
  { title: 'Apocalypse',          artist: 'Cigarettes After Sex', albumColor: '#0e0e1e', genre: 'Dream Pop' },
  { title: 'Exile',               artist: 'Taylor Swift ft. Bon Iver', albumColor: '#1e2a1e', genre: 'Folk' },
  { title: 'Retrograde',          artist: 'James Blake',          albumColor: '#1a1a2e', genre: 'Electronic' },
  { title: 'Breathe',             artist: 'Télépopmusik',         albumColor: '#1e2e2a', genre: 'Downtempo' },
  { title: 'Flicker',             artist: 'Niall Horan',          albumColor: '#2a1e2e', genre: 'Pop' },
  { title: 'Ribs',                artist: 'Lorde',                albumColor: '#2e2a1a', genre: 'Indie Pop' },
  { title: 'Paris',               artist: 'The Chainsmokers',     albumColor: '#1a2a2e', genre: 'Electropop' },
  { title: 'Holocene',            artist: 'Bon Iver',             albumColor: '#1e1e2e', genre: 'Folk' },
  { title: 'Thinkin Bout You',    artist: 'Frank Ocean',          albumColor: '#2e1a2e', genre: 'R&B' },
  { title: 'Skinny Love',         artist: 'Bon Iver',             albumColor: '#1e2e1e', genre: 'Folk' },
]

export default function DiscoverPage() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="px-6 py-8 lg:px-8 lg:py-10 max-w-[1200px]">

      {/* Header */}
      <header className="mb-8">
        <h1
          className="text-3xl lg:text-4xl font-semibold tracking-tight"
          style={{ color: 'var(--foreground)', lineHeight: 1.2 }}
        >
          Discover
        </h1>
        <p className="mt-2 text-base" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          Explore genres, moods, and new sounds.
        </p>
      </header>

      {/* Filter pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide mb-8"
        role="group"
        aria-label="Mood filters"
      >
        {MOOD_FILTERS.map(mood => (
          <button
            key={mood}
            onClick={() => setActive(a => a === mood ? null : mood)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-150 whitespace-nowrap"
            style={{
              background:  active === mood ? 'var(--accent)' : 'var(--bg-card)',
              color:       active === mood ? '#ffffff' : 'var(--muted)',
              border:      `1px solid ${active === mood ? 'var(--accent)' : 'var(--border)'}`,
            }}
            aria-pressed={active === mood}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* 3-column grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Discover tracks">
        {DISCOVER_TRACKS.map(track => (
          <DiscoverCard key={track.title} {...track} />
        ))}
      </section>

      {/* Load more */}
      <div className="flex justify-center mt-10">
        <button
          className="px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-accent/10"
          style={{
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            background: 'transparent',
          }}
        >
          Load more
        </button>
      </div>

    </div>
  )
}
