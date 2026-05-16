'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { handleCallback } from '@/src/lib/spotify-auth'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleCallback()
        // Redirect to home after successful authentication
        router.push('/')
      } catch (error) {
        console.error('Authentication failed:', error)
        // Redirect to home even on error (user can try again)
        router.push('/')
      }
    }

    processCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg" style={{ color: 'var(--foreground)' }}>
          Authenticating with Spotify...
        </p>
      </div>
    </div>
  )
}
