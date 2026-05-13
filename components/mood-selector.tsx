'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const MOODS = ['Melancholic', 'Energetic', 'Focused', 'Euphoric', 'Nostalgic']
const ENERGIES = ['Low', 'Medium', 'High']

interface MoodSelectorProps {
  onMoodChange?: (mood: string | null) => void
  onEnergyChange?: (energy: string | null) => void
  onIntensityChange?: (intensity: number) => void
  defaultMood?: string | null
  defaultEnergy?: string | null
  defaultIntensity?: number
}

export function MoodSelector({
  onMoodChange,
  onEnergyChange,
  onIntensityChange,
  defaultMood = null,
  defaultEnergy = null,
  defaultIntensity = 5,
}: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(defaultMood)
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(defaultEnergy)
  const [intensity, setIntensity] = useState(defaultIntensity)

  const handleMood = (mood: string) => {
    const next = selectedMood === mood ? null : mood
    setSelectedMood(next)
    onMoodChange?.(next)
  }

  const handleEnergy = (energy: string) => {
    const next = selectedEnergy === energy ? null : energy
    setSelectedEnergy(next)
    onEnergyChange?.(next)
  }

  const handleIntensity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setIntensity(val)
    onIntensityChange?.(val)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mood row */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5">Mood</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(mood => (
            <button
              key={mood}
              onClick={() => handleMood(mood)}
              className={cn(
                'px-3 py-1.5 text-sm rounded border transition-colors duration-150',
                selectedMood === mood
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border text-muted-foreground hover:border-accent hover:text-accent'
              )}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Energy row */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5">Energy</p>
        <div className="flex flex-wrap gap-2">
          {ENERGIES.map(energy => (
            <button
              key={energy}
              onClick={() => handleEnergy(energy)}
              className={cn(
                'px-3 py-1.5 text-sm rounded border transition-colors duration-150',
                selectedEnergy === energy
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border text-muted-foreground hover:border-accent hover:text-accent'
              )}
            >
              {energy}
            </button>
          ))}
        </div>
      </div>

      {/* Intensity slider */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Intensity</p>
          <span className="text-sm font-medium text-accent tabular-nums">{intensity}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={handleIntensity}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) ${(intensity - 1) / 9 * 100}%, var(--border) ${(intensity - 1) / 9 * 100}%)`,
          }}
          aria-label="Intensity"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">1</span>
          <span className="text-xs text-muted-foreground">10</span>
        </div>
      </div>
    </div>
  )
}
