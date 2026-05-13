'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

const TASTE_DATA = [
  { genre: 'Hip-Hop',    score: 72 },
  { genre: 'Electronic', score: 55 },
  { genre: 'Indie',      score: 88 },
  { genre: 'R&B',        score: 65 },
  { genre: 'Rock',       score: 40 },
  { genre: 'Pop',        score: 78 },
]

export function TasteRadar() {
  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={TASTE_DATA} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
          <PolarGrid stroke="#1F2230" />
          <PolarAngleAxis
            dataKey="genre"
            tick={{
              fill: '#6B7280',
              fontSize: 11,
              fontFamily: 'var(--font-sans)',
            }}
          />
          <Radar
            name="Taste"
            dataKey="score"
            stroke="#7C5CFF"
            fill="#7C5CFF"
            fillOpacity={0.12}
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
