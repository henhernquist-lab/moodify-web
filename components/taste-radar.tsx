'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

const TASTE_DATA = [
  { genre: 'Hip-Hop', score: 72 },
  { genre: 'Electronic', score: 55 },
  { genre: 'Indie', score: 88 },
  { genre: 'R&B', score: 65 },
  { genre: 'Rock', score: 40 },
  { genre: 'Pop', score: 78 },
]

export function TasteRadar() {
  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={TASTE_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="genre"
            tick={{
              fill: 'var(--muted-foreground)',
              fontSize: 12,
              fontFamily: 'var(--font-sans)',
            }}
          />
          <Radar
            name="Taste"
            dataKey="score"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
