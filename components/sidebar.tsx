'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Search, Library, User } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home',        href: '/',            icon: Home },
  { label: 'Discover',   href: '/discover',    icon: Compass },
  { label: 'Mood Search',href: '/mood-search', icon: Search },
  { label: 'Library',    href: '/library',     icon: Library },
  { label: 'Profile',    href: '/profile',     icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

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
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-100"
              style={{
                color:           active ? '#ffffff' : 'var(--muted)',
                background:      active ? 'rgba(124,92,255,0.12)' : 'transparent',
                borderLeft:      active ? '2px solid var(--accent)' : '2px solid transparent',
                paddingLeft:     active ? '10px' : '12px',
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
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors duration-100"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: 'var(--bg-card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            JD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>Jamie D.</p>
            <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>Free plan</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
