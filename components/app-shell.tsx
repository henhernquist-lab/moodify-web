'use client'

import { Sidebar } from '@/components/sidebar'
import { MiniPlayer } from '@/components/mini-player'
import { MobileNav } from '@/components/mobile-nav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      {/* Persistent left sidebar — desktop only */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main
          className="flex-1 page-enter"
          /* bottom padding: 64px player + 56px mobile nav on mobile; 72px player on desktop */
          style={{ paddingBottom: 'calc(64px + 56px)' }}
        >
          {children}
        </main>
      </div>

      {/* Persistent mini player */}
      <MiniPlayer />

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
