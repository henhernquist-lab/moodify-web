'use client'

export function PlayingIndicator() {
  return (
    <span className="inline-flex items-end gap-[2px] h-4" aria-label="Now playing">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-[3px] rounded-full playing-bar"
          style={{
            backgroundColor: 'var(--accent)',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </span>
  )
}
