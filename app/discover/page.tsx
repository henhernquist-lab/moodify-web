'use client'

import { useState, useEffect } from 'react'
import { SearchInput } from '@/components/search-input'
import { DiscoverCard } from '@/components/discover-card'
import { WaveformResultCard } from '@/components/waveform-result-card'
import { SkeletonCard } from '@/components/skeleton-card'
import { getSimilarTracks } from '@/lib/lastfm'
import { Music } from 'lucide-react'

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
  const [selectedTrack, setSelectedTrack] = useState<{ name: string; artist: string; image?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (track: { name: string; artist: string; image?: string }) => {
    setSelectedTrack(track)
    setLoading(true)
    setError(null)
    setResults([])

    try {
      const similar = await getSimilarTracks(track.name, track.artist, 9)
      if (similar.length === 0) {
        setError('No similar tracks found')
      } else {
        setResults(similar)
      }
    } catch (err) {
      console.error('[v0] Search error:', err)
      setError('Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }

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
          Explore genres, moods, and new sounds. Find your next favorite track.
        </p>
      </header>

      {/* Search section */}
      {!selectedTrack && (
        <div className="mb-10">
          <label className="block text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>
            Find similar songs
          </label>
          <div className="max-w-md">
            <SearchInput
              onSelect={handleSearch}
              placeholder="Enter a song or artist..."
            />
          </div>
        </div>
      )}

      {/* Search results */}
      {selectedTrack && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Similar to <span style={{ color: 'var(--accent)' }}>&ldquo;{selectedTrack.name}&rdquo;</span>
            </h2>
            <button
              onClick={() => {
                setSelectedTrack(null)
                setResults([])
                setError(null)
              }}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              ← Back
            </button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && (
            <>
              {error && results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ background: 'rgba(124,92,255,0.1)' }}>
                    <Music size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <p className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
                    {error}
                  </p>
                  <button
                    onClick={() => setSelectedTrack(null)}
                    className="mt-6 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      background: 'var(--accent)',
                      color: '#ffffff',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'
                    }}
                  >
                    Try Another Song
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((result, i) => (
                    <div
                      key={`${result.name}-${result.artist}-${i}`}
                      style={{
                        animation: `fadeIn 0.2s ease-out`,
                        animationDelay: `${i * 0.05}s`,
                        animationFillMode: 'both',
                      }}
                    >
                      <WaveformResultCard
                        title={result.name}
                        artist={result.artist}
                        coverArt={result.image}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {!selectedTrack && (
        <>
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
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10" aria-label="Discover tracks">
            {DISCOVER_TRACKS.map(track => (
              <DiscoverCard key={track.title} {...track} />
            ))}
          </section>

          {/* Load more */}
          <div className="flex justify-center">
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
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  )
}
