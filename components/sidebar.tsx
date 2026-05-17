'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Compass, Search, Library, User } from 'lucide-react'
import { useAuth } from '@/src/context/AuthContext'
import { signOut } from '@/src/lib/auth'
import * as Popover from '@radix-ui/react-popover';
import { SpotifyImage } from '@/components/spotify-image';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home, protected: false },
  { label: 'Discover', href: '/discover', icon: Compass, protected: false },
  { label: 'Mood Search',href: '/mood-search', icon: Search, protected: false },
  { label: 'Library', href: '/library', icon: Library, protected: true },
  { label: 'Profile', href: '/profile', icon: User, protected: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signIn } = useAuth()

  const handleNavClick = (e, href, isProtected) => {
    if (isProtected && !user) {
      e.preventDefault()
      signIn()
    }
  }

  return (
    <aside
      className="hidden lg:flex flex-col w-[220px] flex-shrink-0 h-screen sticky top-0"
      style={{ background: 'var(--bg-deep)', borderRight: '1px solid var(--border)' }}
      aria-label="Main navigation"
    >
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-8">
        <Link href="/" className="font-serif italic text-[22px] tracking-tight" style={{ color: 'var(--accent)' }}>
          Moodify
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon, protected: isProtected }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href, isProtected)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-100"
              style={{
                color: active ? '#ffffff' : 'var(--muted)',
                background: active ? 'rgba(124,92,255,0.12)' : 'transparent',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                paddingLeft: active ? '10px' : '12px',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              <span className={active ? 'font-medium' : 'font-normal'}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User avatar */}
      <div className="px-3 pb-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {user ? (
          <Popover.Root>
            <Popover.Trigger className="w-full">
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors duration-100 w-full">
                <div className="w-7 h-7 flex-shrink-0">
                  <SpotifyImage src={user.photoURL} alt={user.displayName || ''} type="artist" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-left" style={{ color: 'var(--foreground)' }}>{user.displayName}</p>
                </div>
              </div>
            </Popover.Trigger>
            <Popover.Content className="w-48 bg-[#11131A] border border-[#2A2D3E] rounded-md shadow-lg p-1">
              <Link href="/profile" className="block px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md">Profile</Link>
              <button onClick={() => signOut()} className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md">Sign Out</button>
            </Popover.Content>
          </Popover.Root>
        ) : (
          <button onClick={() => signIn()} className="w-full p-3 bg-[#7C5CFF] rounded text-white font-bold">Sign In</button>
        )}
      </div>
    </aside>
  )
}
