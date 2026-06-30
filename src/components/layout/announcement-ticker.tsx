import type { SiteSetting } from '@/payload-types'

export function AnnouncementTicker({ siteSettings }: { siteSettings: SiteSetting }) {
  const items = siteSettings?.tickerItems ?? []
  if (!items.length) return null

  const texts = items.map((i) => i.text)
  const repeated = [...texts, ...texts]

  return (
    <div className="relative overflow-hidden bg-ink-700 py-3">
      {/* gradient accent line on top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />

      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink-700 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink-700 to-transparent" />

      <div className="flex min-w-full animate-marquee whitespace-nowrap will-change-transform">
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
  )
}
