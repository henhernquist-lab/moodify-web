'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { MoodSelector } from '@/components/mood-selector'

/** Mobile bottom-sheet trigger only */
export function RefineMobileSheet() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors duration-150"
      >
        <SlidersHorizontal size={15} />
        Refine your vibe
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 bg-surface border-t border-border rounded-t-xl p-6 pb-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-foreground">Refine your vibe</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <X size={18} />
              </button>
            </div>
            <MoodSelector />
          </div>
        </div>
      )}
    </div>
  )
}

/** Desktop sticky sidebar only */
export function RefineSidebar() {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={15} className="text-accent" />
          <p className="text-sm font-semibold text-foreground">Refine your vibe</p>
        </div>
        <MoodSelector />
      </div>
    </aside>
  )
}
