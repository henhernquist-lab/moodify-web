'use client'

import { useState, useEffect } from 'react'
import { MusicCard } from '@/components/music-card'
import { ScrollRow } from '@/components/scroll-row'

export function RecentSearches() {
  const [searches, setSearches] = useState<any[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('moodify_recent_searches') || '[]')
    setSearches(stored)
  }, [])

  if (searches.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Recently Searched</h2>
        <a href="#" className="text-xs" style={{ color: 'var(--muted)' }}>See all</a>
      </div>
      <ScrollRow>
        {searches.slice(0, 6).map((search: any, idx: number) => (
          <MusicCard
            key={`${search.track}-${idx}`}
            title={search.track}
            artist={search.artist}
            albumColor={search.coverArt ? 'transparent' : '#1a1a2e'}
            showSaveButton
          />
        ))}
      </ScrollRow>
    </section>
  )
}
