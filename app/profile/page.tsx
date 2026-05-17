'use client'

import { useState } from 'react'
import { X, Music2 } from 'lucide-react'
import { TasteRadar } from '@/components/taste-radar'
import { ScrollRow } from '@/components/scroll-row'
import { SpotifyImage } from '@/components/spotify-image'

const TOP_ARTISTS = [
  { name: 'Frank Ocean',      image: null },
  { name: 'Lorde',            image: null },
  { name: 'Bon Iver',         image: null },
  { name: 'James Blake',      image: null },
  { name: 'Phoebe Bridgers',  image: null },
  { name: 'Kacey Musgraves',  image: null },
]

const STATS = [
  { label: 'Songs Saved',     value: '148' },
  { label: 'Moods Explored',  value: '12' },
  { label: 'Listening Streak',value: '9 days' },
]

const GENRE_BREAKDOWN = [
  { genre: 'Indie',      score: 88 },
  { genre: 'Pop',        score: 78 },
  { genre: 'Hip-Hop',    score: 72 },
  { genre: 'R&B',        score: 65 },
  { genre: 'Electronic', score: 55 },
  { genre: 'Rock',       score: 40 },
]

export default function ProfilePage() {
  const [surveyDismissed, setSurveyDismissed] = useState(false)

  return (
    <div className="px-6 py-8 lg:px-8 lg:py-10 max-w-[1200px]">

      {/* Survey banner */}
      {!surveyDismissed && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg mb-8"
          style={{ background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.25)' }}
          role="banner"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Help us tune your experience.
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Tell us your favorite artists so we can refine your recommendations.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:brightness-110"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              Take Survey
            </button>
            <button
              onClick={() => setSurveyDismissed(true)}
              aria-label="Dismiss survey banner"
              className="transition-opacity duration-150 hover:opacity-60"
              style={{ color: 'var(--muted)' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Profile header */}
      <header className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 flex-shrink-0">
          <SpotifyImage src={null} alt="JD" type="artist" />
        </div>
        <div>
          <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Jamie D.</p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Member since January 2024</p>
        </div>
      </header>

      {/* Listening Stats */}
      <section className="mb-10" aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="text-xs font-medium tracking-widest uppercase mb-4"
          style={{ color: 'var(--muted)' }}
        >
          Listening Stats
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
                {value}
              </p>
              <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Two-col: taste radar + top artists */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">

        {/* Taste Profile */}
        <section className="flex-1" aria-labelledby="taste-heading">
          <h2
            id="taste-heading"
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: 'var(--muted)' }}
          >
            Taste Profile
          </h2>
          <div
            className="rounded-lg p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <TasteRadar />
            <div className="mt-5 flex flex-col gap-3">
              {GENRE_BREAKDOWN.map(({ genre, score }) => (
                <div key={genre} className="flex items-center gap-3">
                  <span className="text-xs w-20 flex-shrink-0" style={{ color: 'var(--muted)' }}>{genre}</span>
                  <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${score}%`, background: 'var(--accent)', opacity: 0.7 }}
                    />
                  </div>
                  <span className="text-xs tabular-nums w-8 text-right" style={{ color: 'var(--muted)' }}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Artists */}
        <section className="lg:w-72 flex-shrink-0" aria-labelledby="artists-heading">
          <h2
            id="artists-heading"
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: 'var(--muted)' }}
          >
            Top Artists
          </h2>
          <div className="flex flex-col gap-1">
            {TOP_ARTISTS.map(({ name, image }) => (
              <div
                key={name}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-100 cursor-pointer"
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="w-9 h-9 flex-shrink-0">
                  <SpotifyImage src={image} alt={name} type="artist" />
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{name}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  )
}
