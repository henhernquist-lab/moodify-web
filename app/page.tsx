'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { MoodSelector } from '@/components/mood-selector'
import { SmallSongCard } from '@/components/small-song-card'
import { ThemeProvider } from '@/components/theme-provider'

const RECENT_SEARCHES = [
  { title: 'Redbone', artist: 'Childish Gambino' },
  { title: 'Midnight Rain', artist: 'Taylor Swift' },
  { title: 'Nights', artist: 'Frank Ocean' },
  { title: 'Motion Sickness', artist: 'Phoebe Bridgers' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const router = useRouter()

  const handleDiscover = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/results?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-2xl mx-auto w-full">
          {/* Hero */}
          <section className="w-full text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight mb-4">
              Find your next<br />favorite song.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed text-balance">
              Type a track you love or describe how you&apos;re feeling.
            </p>
          </section>

          {/* Search + discover form */}
          <form onSubmit={handleDiscover} className="w-full flex flex-col gap-6">
            {/* Search bar */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
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
                className="w-full h-14 pl-12 pr-4 bg-surface border rounded-lg text-foreground placeholder:text-muted-foreground text-base outline-none transition-colors duration-150"
                style={{
                  borderColor: focused ? 'var(--accent)' : 'var(--border)',
                  boxShadow: focused ? `0 0 0 1px var(--accent)` : 'none',
                }}
              />
            </div>

            {/* Mood & energy selectors */}
            <div className="rounded-lg border border-border bg-card p-6">
              <MoodSelector />
            </div>

            {/* Discover button */}
            <button
              type="submit"
              className="w-full md:w-48 md:mx-auto h-12 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent-hover transition-colors duration-150"
            >
              Discover
            </button>
          </form>

          {/* Recently searched */}
          <section className="w-full mt-14" aria-label="Recently searched">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Recently Searched
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {RECENT_SEARCHES.map(song => (
                <SmallSongCard
                  key={song.title}
                  title={song.title}
                  artist={song.artist}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  )
}
