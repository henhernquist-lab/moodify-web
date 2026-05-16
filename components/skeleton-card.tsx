'use client'

export function SkeletonCard() {
  return (
    <article
      className="rounded-lg overflow-hidden animate-pulse"
      style={{
        background: '#1F2230',
      }}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div
            className="h-4 rounded"
            style={{
              background: 'rgba(124,92,255,0.1)',
              width: '80%',
              animation: 'shimmer 1.5s infinite',
              animationDirection: 'forwards',
            }}
          />
          <div
            className="h-3 rounded"
            style={{
              background: 'rgba(124,92,255,0.1)',
              width: '60%',
            }}
          />
        </div>

        {/* Waveform */}
        <div className="h-14 flex items-end gap-[2px]">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                background: 'rgba(124,92,255,0.1)',
                height: `${Math.random() * 60 + 30}%`,
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          className="h-3 rounded"
          style={{
            background: 'rgba(124,92,255,0.1)',
            width: '40%',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </article>
  )
}
