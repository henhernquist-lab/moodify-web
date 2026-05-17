'use client'

import { useState, useEffect } from 'react'
import { Music } from 'lucide-react'

interface SpotifyImageProps {
  src?: string | null
  alt?: string
  type?: 'artist' | 'track'
  className?: string
}

export function SpotifyImage({ src, alt = '', type = 'track', className = '' }: SpotifyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Reset state if src changes
  useEffect(() => {
    setLoaded(false)
    setError(false)
  }, [src])

  const borderRadius = type === 'artist' ? '50%' : '8px'
  const isPlaceholder = !src || error

  if (isPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: '#171A22',
          borderRadius,
          width: '100%',
          height: '100%',
        }}
        aria-hidden="true"
      >
        <Music size={24} style={{ color: '#2A2D3E' }} />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ borderRadius, width: '100%', height: '100%' }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className="w-full h-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
        }}
      />
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: '#171A22' }}
        >
          <Music size={24} style={{ color: '#2A2D3E' }} />
        </div>
      )}
    </div>
  )
}
