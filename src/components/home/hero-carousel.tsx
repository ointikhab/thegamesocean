'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { resolveImage } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { Banner } from '@/payload-types'

const themeConfig: Record<string, {
  accentBar: string
  ctaGradient: string
  eyebrowBg: string
  eyebrowText: string
  glowColor: string
  overlayFrom: string
}> = {
  violet: {
    accentBar: 'from-violet-glow via-cyan-glow to-transparent',
    ctaGradient: 'from-violet-glow to-cyan-glow',
    eyebrowBg: 'bg-violet-glow/10 border-violet-glow/30 text-violet-glow',
    eyebrowText: 'text-violet-glow',
    glowColor: 'rgba(124,58,237,0.4)',
    overlayFrom: 'from-white/90',
  },
  magenta: {
    accentBar: 'from-magenta-glow via-violet-glow to-transparent',
    ctaGradient: 'from-magenta-glow to-violet-glow',
    eyebrowBg: 'bg-magenta-glow/10 border-magenta-glow/30 text-magenta-glow',
    eyebrowText: 'text-magenta-glow',
    glowColor: 'rgba(219,39,119,0.4)',
    overlayFrom: 'from-white/90',
  },
  cyan: {
    accentBar: 'from-cyan-glow via-emerald-glow to-transparent',
    ctaGradient: 'from-cyan-glow to-emerald-glow',
    eyebrowBg: 'bg-cyan-glow/10 border-cyan-glow/30 text-cyan-glow',
    eyebrowText: 'text-cyan-glow',
    glowColor: 'rgba(8,145,178,0.4)',
    overlayFrom: 'from-white/90',
  },
}

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (banners.length < 2 || isHovered) return
    const id = setInterval(() => setActive((a) => (a + 1) % banners.length), 6500)
    return () => clearInterval(id)
  }, [banners.length, isHovered])

  if (banners.length === 0) return null

  const banner = banners[active]
  const image = resolveImage(typeof banner.image === 'object' ? banner.image : null, 'large')
  const theme = themeConfig[banner.theme || 'violet'] ?? themeConfig.violet

  return (
    <section
      className="relative mx-auto mt-4 max-w-[1440px] px-3 sm:px-5 lg:px-7"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[82vh] max-h-[820px] min-h-[560px] overflow-hidden rounded-3xl border border-surface-300 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">

        {/* Background image */}
        <AnimatePresence mode="sync">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute inset-0"
          >
            <Image
              src={image.url}
              alt={image.alt || banner.title}
              fill
              priority={active === 0}
              sizes="100vw"
              className="object-cover"
            />
            {/* White gradient overlay — left side so text is legible */}
            <div className={cn('absolute inset-0 bg-gradient-to-r', theme.overlayFrom, 'via-white/60 to-white/10')} />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Floating glow orb behind CTA area */}
        <div
          className="animate-orb-drift pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${theme.glowColor}, transparent 70%)` }}
        />

        {/* Top accent bar */}
        <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90', theme.accentBar)} />

        {/* Corner decorations */}
        <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l-2 border-t-2 border-ink-900/15 rounded-tl-sm" />
        <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r-2 border-t-2 border-ink-900/15 rounded-tr-sm" />
        <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b-2 border-l-2 border-ink-900/10 rounded-bl-sm" />
        <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-ink-900/10 rounded-br-sm" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end gap-5 p-8 sm:p-12 lg:max-w-3xl lg:justify-center lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              {banner.eyebrow && (
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.25em] backdrop-blur-sm',
                    theme.eyebrowBg,
                  )}>
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-current" />
                    {banner.eyebrow}
                  </span>
                </div>
              )}

              <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink-900 sm:text-5xl lg:text-7xl">
                {banner.title}
              </h1>

              {banner.subtitle && (
                <p className="max-w-lg text-balance text-sm leading-relaxed text-ink-500 sm:text-base lg:text-lg">
                  {banner.subtitle}
                </p>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Link
                  href={banner.ctaHref || '/shop'}
                  className={cn(
                    'group inline-flex items-center gap-2.5 rounded-2xl px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(124,58,237,0.35)]',
                    'bg-gradient-to-r',
                    theme.ctaGradient,
                  )}
                >
                  <Zap size={14} className="shrink-0" />
                  {banner.ctaLabel || 'Shop now'}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-2xl border border-ink-900/15 bg-white/70 backdrop-blur-sm px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-ink-700 transition-all hover:border-ink-900/30 hover:bg-white/90 hover:text-ink-900"
                >
                  Explore all
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide controls */}
        {banners.length > 1 && (
          <>
            <div className="absolute bottom-8 right-10 z-10 hidden items-center gap-2 sm:flex">
              <button
                onClick={() => setActive((a) => (a - 1 + banners.length) % banners.length)}
                aria-label="Previous slide"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-md border border-surface-300 text-ink-700 shadow-sm transition-all hover:bg-white hover:shadow-md hover:scale-105"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setActive((a) => (a + 1) % banners.length)}
                aria-label="Next slide"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-md border border-surface-300 text-ink-700 shadow-sm transition-all hover:bg-white hover:shadow-md hover:scale-105"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="absolute bottom-10 left-10 z-10 flex items-center gap-2">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-500',
                    i === active
                      ? cn('w-10 bg-gradient-to-r', theme.ctaGradient)
                      : 'w-2 bg-ink-900/20 hover:bg-ink-900/40',
                  )}
                />
              ))}
              <span className="ml-2 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-ink-400">
                {String(active + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
