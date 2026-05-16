import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/app-shell'
import { NowPlayingProvider } from '@/src/lib/now-playing'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Moodify — Find Your Next Favorite Song',
  description:
    'Discover music based on how you feel. Enter a track you love or describe your mood and Moodify surfaces songs that match your vibe.',
}

export const viewport: Viewport = {
  themeColor: '#0B0B0F',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <NowPlayingProvider>
          <AppShell>{children}</AppShell>
        </NowPlayingProvider>
      </body>
    </html>
  )
}
