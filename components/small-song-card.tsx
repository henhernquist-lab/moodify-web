import { cn } from '@/lib/utils'

interface SmallSongCardProps {
  title: string
  artist: string
  className?: string
}

const COVER_COLORS = [
  ['#1f1035', '#6d28d9'],
  ['#0f1923', '#a855f7'],
  ['#111827', '#7c3aed'],
  ['#0a0a1a', '#c084fc'],
]

export function SmallSongCard({ title, artist, className }: SmallSongCardProps) {
  // deterministic colour based on first char
  const idx = title.charCodeAt(0) % COVER_COLORS.length
  const [bg, fg] = COVER_COLORS[idx]

  return (
    <div
      className={cn(
        'flex-shrink-0 w-36 rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Cover art placeholder */}
      <div
        className="w-full h-24 flex items-center justify-center text-2xl font-serif font-bold"
        style={{ background: bg, color: fg }}
        aria-hidden="true"
      >
        {title.charAt(0)}
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-foreground line-clamp-1">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{artist}</p>
      </div>
    </div>
  )
}
