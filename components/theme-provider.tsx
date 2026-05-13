'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'minimal'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('moodify-theme') as Theme | null
    if (stored === 'minimal') {
      setTheme('minimal')
      document.documentElement.classList.add('minimal')
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'minimal' : 'dark'
      localStorage.setItem('moodify-theme', next)
      if (next === 'minimal') {
        document.documentElement.classList.add('minimal')
      } else {
        document.documentElement.classList.remove('minimal')
      }
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
