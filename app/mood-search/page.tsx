'use client'

import { useState, useEffect } from 'react'
import { SearchInput } from '@/components/search-input'
import { WaveformResultCard } from '@/components/waveform-result-card'
import { SkeletonCard } from '@/components/skeleton-card'
import { getTrackInfo, getSimilarTracks, mapTagsToMoods } from '@/lib/lastfm'
import { Music } from 'lucide-react'

const MOODS    = ['Melancholic', 'Energetic', 'Focused', 'Euphoric', 'Nostalgic', 'Dark', 'Peaceful', 'Rebellious']
const ENERGIES = ['Low', 'Medium', 'High']

interface ResultTrack {
  name: string
  artist: string
  image?: string
}

export default function MoodSearchPage() {
  const [selectedTrack, setSelectedTrack] = useState<{ name: string; artist: string; image?: string } | null>(null)
  const [mood,      setMood]      = useState<string | null>(null)
  const [energy,    setEnergy]    = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [searched,  setSearched]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [results,   setResults]   = useState<ResultTrack[]>([])
  const [autoMoods, setAutoMoods] = useState<string[]>([])
  const [error,     setError]     = useState<string | null>(null)

  const handleSearch = async (track: { name: string; artist: string; image?: string }) => {
    setSelectedTrack(track)
    setSearched(true)
    setLoading(true)
    setError(null)
    setResults([])
    setAutoMoods([])

    try {
      // Get track info to extract tags
      const trackInfo = await getTrackInfo(track.name, track.artist)
      
      if (trackInfo && trackInfo.tags.length > 0) {
        const mappedMoods = mapTagsToMoods(trackInfo.tags)
        setAutoMoods(mappedMoods)
      }

      // Get similar tracks
      const similar = await getSimilarTracks(track.name, track.artist, 9)
      
      if (similar.length === 0) {
        setError('We couldn\'t find similar tracks')
      } else {
        setResults(similar)
      }
    } catch (err) {
      console.error('[v0] Search error:', err)
      setError('Failed to fetch results. Try again.')
    } finally {
      setLoading(false)
    }

    // Save to localStorage
    const recentSearches = JSON.parse(localStorage.getItem('moodify_recent_searches') || '[]')
    recentSearches.unshift({
      track: track.name,
      artist: track.artist,
      timestamp: Date.now(),
      coverArt: track.image,
    })
    localStorage.setItem('moodify_recent_searches', JSON.stringify(recentSearches.slice(0, 8)))
  }

  return (
    <div className="px-6 py-8 lg:px-8 lg:py-10 max-w-[860px]">

      {/* Header */}
      <header className="mb-10 text-center">
        <h1
          className="text-3xl lg:text-4xl font-semibold tracking-tight"
          style={{ color: 'var(--foreground)', lineHeight: 1.2 }}
        >
          What are you feeling?
        </h1>
        <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          Enter a song you love and we&apos;ll find what fits your mood right now.
        </p>
      </header>

      <form className="flex flex-col gap-7">

        {/* Search input */}
        <div>
          <SearchInput
            onSelect={handleSearch}
            placeholder="Enter a song or artist..."
          />
        </div>

        {/* Mood pills */}
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Your mood</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(v => v === m ? null : m)}
                className="px-3 py-1.5 rounded-full text-sm transition-all duration-150"
                style={{
                  background: mood === m ? 'var(--accent)' : 'var(--bg-card)',
                  color:      mood === m ? '#ffffff' : 'var(--muted)',
                  border:     `1px solid ${mood === m ? 'var(--accent)' : 'var(--border)'}`,
                }}
                aria-pressed={mood === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Energy pills */}
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Energy level</p>
          <div className="flex gap-2">
            {ENERGIES.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setEnergy(v => v === e ? null : e)}
                className="px-4 py-1.5 rounded-full text-sm transition-all duration-150"
                style={{
                  background: energy === e ? 'var(--accent)' : 'var(--bg-card)',
                  color:      energy === e ? '#ffffff' : 'var(--muted)',
                  border:     `1px solid ${energy === e ? 'var(--accent)' : 'var(--border)'}`,
                }}
                aria-pressed={energy === e}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Intensity</p>
            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
              {intensity}
            </span>
          </div>
          <input
            type="range"
            className="intensity-slider w-full"
            min={1}
            max={10}
            value={intensity}
            onChange={e => setIntensity(Number(e.target.value))}
            aria-label="Intensity level"
            style={{
              background: `linear-gradient(to right, var(--accent) ${(intensity - 1) * 11.1}%, var(--border) ${(intensity - 1) * 11.1}%)`,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Subtle</span>
            <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Intense</span>
          </div>
        </div>

        {/* Discover button (hidden, use Enter key instead) */}
        <button type="submit" hidden aria-hidden="true" />
      </form>

      {/* Results */}
      {searched && (
        <section className="mt-12">
          {/* Header with auto-selected moods */}
          {selectedTrack && (
            <div className="mb-6 flex flex-col gap-3">
              <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                Songs similar to{' '}
                <span style={{ color: 'var(--accent)' }}>&ldquo;{selectedTrack.name}&rdquo;</span>
              </h2>
              {autoMoods.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {autoMoods.map(m => (
                    <span
                      key={m}
                      className="px-3 py-1.5 rounded-full text-xs"
                      style={{
                        background: 'rgba(124,92,255,0.1)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(124,92,255,0.3)',
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Results or empty state */}
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
                  <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
                    Try a different song or adjust your mood
                  </p>
                  <button
                    onClick={() => {
                      setSearched(false)
                      setSelectedTrack(null)
                    }}
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
                    Try Again
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
