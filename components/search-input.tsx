'use client'

import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { searchTrack } from '@/lib/lastfm'

interface SearchInputProps {
  onSelect: (track: { name: string; artist: string; image?: string }) => void
  placeholder?: string
}

export function SearchInput({ onSelect, placeholder = 'Enter a song or artist...' }: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ name: string; artist: string; image?: string }>>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim() || !focused) {
      setSuggestions([])
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      const results = await searchTrack(query)
      setSuggestions(results)
      setLoading(false)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, focused])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (track: typeof suggestions[0]) => {
    setQuery(`${track.name} - ${track.artist}`)
    setSuggestions([])
    setFocused(false)
    onSelect(track)
  }

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--muted)' }}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        aria-label="Search for a song or artist"
        className="w-full h-14 pl-12 pr-4 text-base rounded-lg outline-none transition-all duration-150"
        style={{
          background: 'var(--bg-card)',
          color: 'var(--foreground)',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: focused ? '0 0 0 1px var(--accent), 0 0 12px rgba(124,92,255,0.15)' : 'none',
        }}
      />

      {/* Dropdown */}
      {focused && (suggestions.length > 0 || loading) && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 left-0 right-0 rounded-lg border z-50 max-h-80 overflow-y-auto"
          style={{
            background: 'var(--bg-base)',
            borderColor: 'var(--border)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }}
        >
          {loading && suggestions.length === 0 ? (
            <div className="p-4 text-center" style={{ color: 'var(--muted)' }}>
              <div className="inline-block w-4 h-4 border-2 border-transparent border-t-accent rounded-full animate-spin"></div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((track, i) => (
              <button
                key={`${track.name}-${track.artist}-${i}`}
                onClick={() => handleSelect(track)}
                className="w-full h-12 px-3 flex items-center gap-3 hover:bg-opacity-100 transition-colors border-b last:border-b-0"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  textAlign: 'left',
                }}
              >
                {/* Album art thumbnail */}
                {track.image ? (
                  <img
                    src={track.image}
                    alt=""
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <Search size={14} style={{ color: 'var(--muted)' }} />
                  </div>
                )}

                {/* Title and artist */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                    {track.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                    {track.artist}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center" style={{ color: 'var(--muted)' }}>
              <p className="text-sm">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
