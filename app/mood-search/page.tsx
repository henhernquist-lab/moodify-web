'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { WaveformResultCard } from '@/components/waveform-result-card'

const MOODS    = ['Melancholic', 'Energetic', 'Focused', 'Euphoric', 'Nostalgic', 'Dark', 'Peaceful', 'Rebellious']
const ENERGIES = ['Low', 'Medium', 'High']

const RESULTS = [
  { title: 'Self Control',          artist: 'Frank Ocean',           duration: '4:12', genre: 'R&B' },
  { title: 'The Night Will Always Win', artist: 'Manchester Orchestra', duration: '3:56', genre: 'Indie' },
  { title: 'Slow Burn',             artist: 'Kacey Musgraves',        duration: '3:40', genre: 'Pop' },
  { title: 'Lost in the Light',     artist: 'Bahamas',                duration: '4:01', genre: 'Folk' },
  { title: 'Golden',                artist: 'Harry Styles',           duration: '3:28', genre: 'Pop' },
  { title: 'Liability',             artist: 'Lorde',                  duration: '3:57', genre: 'Indie Pop' },
  { title: "Comptine d'un autre été", artist: 'Yann Tiersen',         duration: '2:32', genre: 'Classical' },
  { title: 'Motion Sickness',       artist: 'Phoebe Bridgers',        duration: '3:35', genre: 'Indie' },
  { title: 'Retrograde',            artist: 'James Blake',            duration: '4:10', genre: 'Electronic' },
]

export default function MoodSearchPage() {
  const [query,     setQuery]     = useState('')
  const [focused,   setFocused]   = useState(false)
  const [mood,      setMood]      = useState<string | null>(null)
  const [energy,    setEnergy]    = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [searched,  setSearched]  = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearched(true)
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

      <form onSubmit={handleSearch} className="flex flex-col gap-7">

        {/* Search input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--muted)' }}
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter a song or artist..."
            aria-label="Search for a song or artist"
            className="w-full h-14 pl-12 pr-4 text-base rounded-lg outline-none transition-all duration-150"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--foreground)',
              border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
              boxShadow: focused ? '0 0 0 1px var(--accent), 0 0 12px rgba(124,92,255,0.15)' : 'none',
            }}
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

        {/* Discover button */}
        <div className="flex justify-center lg:justify-start">
          <button
            type="submit"
            className="w-full lg:w-[280px] h-12 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              background: 'var(--accent)',
              color: '#ffffff',
              boxShadow: '0 0 0 0 rgba(124,92,255,0)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.boxShadow = '0 0 12px rgba(124,92,255,0.3)'
              el.style.filter = 'brightness(1.1)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.boxShadow = '0 0 0 0 rgba(124,92,255,0)'
              el.style.filter = 'brightness(1)'
            }}
          >
            Discover
          </button>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <section className="mt-12">
          <h2 className="text-base font-semibold mb-6" style={{ color: 'var(--foreground)' }}>
            Songs similar to{' '}
            <span style={{ color: 'var(--accent)' }}>&ldquo;{query}&rdquo;</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESULTS.map(result => (
              <WaveformResultCard key={result.title} {...result} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
