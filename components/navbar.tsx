'use client'

import Link from 'next/link'
import { useTheme } from '@/components/theme-provider'
import { Moon, Sun } from 'lucide-react'

interface NavbarProps {
  showAvatar?: boolean
}

export function Navbar({ showAvatar = false }: NavbarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-bold text-foreground tracking-tight hover:text-accent transition-colors duration-150"
        >
          Moodify
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'minimal' : 'dark'} mode`}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors duration-150"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {showAvatar && (
            <Link href="/profile" aria-label="View profile">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-medium text-foreground hover:border-accent transition-colors duration-150">
                JD
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
