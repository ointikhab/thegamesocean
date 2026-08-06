'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { SiteSetting } from '@/payload-types'

export function AnnouncementTicker({ siteSettings }: { siteSettings: SiteSetting }) {
  const items = siteSettings?.tickerItems ?? []
  const texts = items.map((i) => i.text)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (texts.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % texts.length), 4000)
    return () => clearInterval(id)
  }, [texts.length])

  if (!texts.length) return null

  const repeated = [...texts, ...texts]

  return (
    <div className="relative overflow-hidden bg-ink-700 py-3">
      {/* gradient accent line on top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />

      {/* Mobile: one full message at a time — a continuous scroll never fits a narrow
          screen long enough to read, so every message gets full, undivided display time. */}
      <div className="flex items-center justify-center px-10 text-center md:hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="font-display text-[11px] font-bold uppercase leading-snug tracking-[0.16em] text-white/90"
          >
            {texts[index]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Desktop: continuous marquee */}
      <div className="relative hidden md:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink-700 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink-700 to-transparent" />
        <div className="flex min-w-full whitespace-nowrap will-change-transform [animation:marquee_36s_linear_infinite]">
          {repeated.map((text, idx) => (
            <span key={idx} className="flex shrink-0 items-center gap-6 px-10">
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.22em] text-white/90">
                {text}
              </span>
              <span className="text-[9px] text-violet-glow" style={{ filter: 'drop-shadow(0 0 4px #7c3aed)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
