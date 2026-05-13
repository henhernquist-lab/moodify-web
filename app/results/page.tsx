'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { WaveformCard } from '@/components/waveform-card'
import { RefineMobileSheet, RefineSidebar } from '@/components/refine-drawer'
import { ThemeProvider } from '@/components/theme-provider'

const RESULTS = [
  { title: 'Self Control', artist: 'Frank Ocean', duration: '4:12', genre: 'R&B' },
  { title: 'The Night Will Always Win', artist: 'Manchester Orchestra', duration: '3:56', genre: 'Indie' },
  { title: 'Slow Burn', artist: 'Kacey Musgraves', duration: '3:40', genre: 'Pop' },
  { title: 'Lost in the Light', artist: 'Bahamas', duration: '4:01', genre: 'Folk' },
  { title: 'Golden', artist: 'Harry Styles', duration: '3:28', genre: 'Pop' },
  { title: 'Liability', artist: 'Lorde', duration: '3:57', genre: 'Indie Pop' },
  { title: 'Be Careful', artist: 'Cardi B', duration: '4:22', genre: 'Hip-Hop' },
  { title: "Comptine d'un autre été", artist: 'Yann Tiersen', duration: '2:32', genre: 'Classical' },
  { title: 'Motion Sickness', artist: 'Phoebe Bridgers', duration: '3:35', genre: 'Indie' },
]

const MOOD_TAGS = ['Melancholic', 'Medium Energy', 'Intensity 6']

function ResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? 'your track'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar showAvatar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance leading-tight">
            Songs similar to{' '}
            <span className="text-accent">&ldquo;{decodeURIComponent(query)}&rdquo;</span>
          </h1>
          <div className="flex flex-wrap gap-2 mt-3" role="list" aria-label="Selected filters">
            {MOOD_TAGS.map(tag => (
              <span
                key={tag}
                role="listitem"
                className="text-xs px-2.5 py-1 rounded border border-border text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Mobile refine trigger */}
        <div className="mb-6">
          <RefineMobileSheet />
        </div>

        {/* Grid + desktop sidebar */}
        <div className="flex gap-8 items-start">
          <section
            className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-label="Song results"
          >
            {RESULTS.map(song => (
              <WaveformCard
                key={song.title}
                title={song.title}
                artist={song.artist}
                duration={song.duration}
                genre={song.genre}
              />
            ))}
          </section>

          <RefineSidebar />
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <ThemeProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading results...</p>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </ThemeProvider>
  )
}
