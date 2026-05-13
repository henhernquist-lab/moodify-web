'use client'

import { Bookmark, Music } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { WaveformCard } from '@/components/waveform-card'
import { TasteRadar } from '@/components/taste-radar'
import { ThemeProvider } from '@/components/theme-provider'

const SAVED_SONGS = [
  { title: 'Self Control', artist: 'Frank Ocean', duration: '4:12', genre: 'R&B', saved: true },
  { title: 'Liability', artist: 'Lorde', duration: '3:57', genre: 'Indie Pop', saved: true },
  { title: 'Slow Burn', artist: 'Kacey Musgraves', duration: '3:40', genre: 'Pop', saved: true },
]

const EMPTY_SAVED = false // flip to true to preview empty state
const EMPTY_TASTE = false

export default function ProfilePage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar showAvatar />

        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

          {/* Profile header */}
          <header className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center text-lg font-semibold text-foreground flex-shrink-0">
              JD
            </div>
            <div>
              <p className="font-semibold text-foreground">Jamie D.</p>
              <p className="text-sm text-muted-foreground">Music explorer since 2024</p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-10">

            {/* Saved Songs */}
            <section className="flex-1" aria-labelledby="saved-heading">
              <h2
                id="saved-heading"
                className="text-xs uppercase tracking-widest text-muted-foreground mb-5"
              >
                Saved Songs
              </h2>

              {EMPTY_SAVED ? (
                <div className="flex flex-col items-center justify-center py-16 border border-border rounded-lg gap-3">
                  <Bookmark size={24} className="text-muted-foreground" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">No saved songs yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAVED_SONGS.map(song => (
                    <WaveformCard
                      key={song.title}
                      title={song.title}
                      artist={song.artist}
                      duration={song.duration}
                      genre={song.genre}
                      saved={song.saved}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Taste Profile */}
            <section className="lg:w-72 flex-shrink-0" aria-labelledby="taste-heading">
              <h2
                id="taste-heading"
                className="text-xs uppercase tracking-widest text-muted-foreground mb-5"
              >
                Your Taste Profile
              </h2>

              <div className="rounded-lg border border-border bg-card p-6">
                {EMPTY_TASTE ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <Music size={24} className="text-muted-foreground" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground">Discover songs to build your profile</p>
                  </div>
                ) : (
                  <>
                    <TasteRadar />
                    <div className="mt-4 flex flex-col gap-2">
                      {[
                        { genre: 'Indie', score: 88 },
                        { genre: 'Pop', score: 78 },
                        { genre: 'Hip-Hop', score: 72 },
                      ].map(({ genre, score }) => (
                        <div key={genre} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-16">{genre}</span>
                          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-accent transition-all duration-300"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                            {score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
