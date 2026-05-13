'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Search, Library, User } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home',     href: '/',            icon: Home },
  { label: 'Discover', href: '/discover',    icon: Compass },
  { label: 'Search',   href: '/mood-search', icon: Search },
  { label: 'Library',  href: '/library',     icon: Library },
  { label: 'Profile',  href: '/profile',     icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center h-14"
      style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--border)' }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-opacity duration-100"
            style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}
            aria-current={active ? 'page' : undefined}
            aria-label={label}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span className="text-[10px]">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
