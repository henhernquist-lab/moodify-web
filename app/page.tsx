'use client'

import { useState, useEffect } from 'react'
import { MusicCard } from '@/components/music-card'
import { ScrollRow } from '@/components/scroll-row'
import { getSavedPlaylistObjects } from '@/src/lib/playlists'
import type { SavedPlaylist } from '@/src/lib/playlists'

const RECENTLY_PLAYED = [
  { title: 'Redbone',          artist: 'Childish Gambino', albumColor: '#4a1c2e' },
  { title: 'Nights',           artist: 'Frank Ocean',      albumColor: '#1b2a4a' },
  { title: 'Midnight Rain',    artist: 'Taylor Swift',     albumColor: '#2a1a4e' },
  { title: 'Motion Sickness',  artist: 'Phoebe Bridgers',  albumColor: '#1e3a2a' },
  { title: 'Supercut',         artist: 'Lorde',            albumColor: '#3a1a1a' },
  { title: 'Pink + White',     artist: 'Frank Ocean',      albumColor: '#2e2040' },
]

const MOOD_RECS = [
  { title: 'Slow Burn',        artist: 'Kacey Musgraves',  albumColor: '#2a3a1e' },
  { title: 'Liability',        artist: 'Lorde',            albumColor: '#1a1a3a' },
  { title: 'Lost in the Light',artist: 'Bahamas',          albumColor: '#2a1e1e' },
  { title: 'Saturn',           artist: 'Stevie Wonder',    albumColor: '#1e2a3a' },
  { title: 'Golden Hour',      artist: 'JVKE',             albumColor: '#3a2a1a' },
  { title: 'Electric Feel',    artist: 'MGMT',             albumColor: '#1a3a2a' },
]

const TRENDING = [
  { title: 'Espresso',         artist: 'Sabrina Carpenter',albumColor: '#3a1e2a' },
  { title: 'Please Please Please', artist: 'Sabrina Carpenter', albumColor: '#2e1a3a' },
  { title: 'Birds of a Feather', artist: 'Billie Eilish',  albumColor: '#0e1e2a' },
  { title: 'Good Luck, Babe!', artist: 'Chappell Roan',    albumColor: '#3a1a2e' },
  { title: 'LUNCH',            artist: 'Billie Eilish',    albumColor: '#1a2e1a' },
  { title: 'Not Like Us',      artist: 'Kendrick Lamar',   albumColor: '#2a1a1a' },
]

const PLACEHOLDER_MIXES = [
  { title: 'Generate your first vibe mix', artist: 'Head to Mood Search to create one', albumColor: '#1a1a3e' },
  { title: 'Your saved mixes appear here', artist: 'Discover music that matches your mood', albumColor: '#0e2a2a' },
]

export default function HomePage() {
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([])

  useEffect(() => {
    setSavedPlaylists(getSavedPlaylistObjects())
  }, [])

  const vibeMixes = savedPlaylists.length > 0
    ? savedPlaylists.map((pl) => ({
        title: pl.name,
        artist: `${pl.tracks.length} songs · ${pl.mood} · ${pl.energy}`,
        albumColor: '#1a1a3e',
      }))
    : PLACEHOLDER_MIXES

  return (
    <div className="px-6 py-8 lg:px-8 lg:py-10 max-w-[1200px]">

      {/* Greeting */}
      <header className="mb-12">
        <h1
          className="text-3xl lg:text-4xl font-semibold tracking-tight"
          style={{ color: 'var(--foreground)', lineHeight: 1.2 }}
        >
          Good evening, Jamie.
        </h1>
        <p className="mt-2 text-base" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          {"Here's what matches your vibe tonight."}
        </p>
      </header>

      {/* Recently Played */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Recently Played</h2>
          <a href="#" className="text-xs" style={{ color: 'var(--muted)' }}>See all</a>
        </div>
        <ScrollRow>
          {RECENTLY_PLAYED.map(card => (
            <MusicCard key={card.title} {...card} showSaveButton />
          ))}
        </ScrollRow>
      </section>

      {/* Mood-Based Recommendations */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Based on Your Mood</h2>
          <a href="#" className="text-xs" style={{ color: 'var(--muted)' }}>See all</a>
        </div>
        <ScrollRow>
          {MOOD_RECS.map(card => (
            <MusicCard key={card.title} {...card} showSaveButton />
          ))}
        </ScrollRow>
      </section>

      {/* Trending */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Trending Right Now</h2>
          <a href="#" className="text-xs" style={{ color: 'var(--muted)' }}>See all</a>
        </div>
        <ScrollRow>
          {TRENDING.map(card => (
            <MusicCard key={card.title} {...card} showSaveButton />
          ))}
        </ScrollRow>
      </section>

      {/* AI Vibe Mixes */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>AI Vibe Mixes</h2>
          {savedPlaylists.length > 0 && (
            <a href="/mood-search" className="text-xs" style={{ color: 'var(--muted)' }}>Create new</a>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vibeMixes.map(card => (
            <a
              key={card.title}
              href="/mood-search"
              className="block"
              style={{ textDecoration: 'none' }}
            >
              <MusicCard {...card} variant="landscape" />
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
