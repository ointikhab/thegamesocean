'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { resolveImage } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { HomePage, Media } from '@/payload-types'

export type HeroSlide = NonNullable<NonNullable<HomePage['heroSlides']>[number]> & {
  image: number | Media
}

const AUTOPLAY_MS = 7000

const themeConfig: Record<string, {
  accentBar: string
  ctaGradient: string
  ctaGradientHover: string
  eyebrowBorder: string
  eyebrowText: string
  glowColor: string
  dotActive: string
  progressBar: string
}> = {
  violet: {
    accentBar: 'from-violet-glow via-cyan-glow to-transparent',
    ctaGradient: 'from-violet-glow to-cyan-glow',
    ctaGradientHover: 'shadow-[0_8px_40px_rgba(124,58,237,0.5)]',
    eyebrowBorder: 'border-violet-glow/40 text-violet-glow',
    eyebrowText: 'text-violet-glow',
    glowColor: 'rgba(124,58,237,0.5)',
    dotActive: 'from-violet-glow to-cyan-glow',
    progressBar: 'from-violet-glow to-cyan-glow',
  },
  magenta: {
    accentBar: 'from-magenta-glow via-violet-glow to-transparent',
    ctaGradient: 'from-magenta-glow to-violet-glow',
    ctaGradientHover: 'shadow-[0_8px_40px_rgba(219,39,119,0.5)]',
    eyebrowBorder: 'border-magenta-glow/40 text-magenta-glow',
    eyebrowText: 'text-magenta-glow',
    glowColor: 'rgba(219,39,119,0.5)',
    dotActive: 'from-magenta-glow to-violet-glow',
    progressBar: 'from-magenta-glow to-violet-glow',
  },
  cyan: {
    accentBar: 'from-cyan-glow via-emerald-500 to-transparent',
    ctaGradient: 'from-cyan-glow to-emerald-500',
    ctaGradientHover: 'shadow-[0_8px_40px_rgba(8,145,178,0.5)]',
    eyebrowBorder: 'border-cyan-glow/40 text-cyan-glow',
    eyebrowText: 'text-cyan-glow',
    glowColor: 'rgba(8,145,178,0.5)',
    dotActive: 'from-cyan-glow to-emerald-500',
    progressBar: 'from-cyan-glow to-emerald-500',
  },
}

function VideoBackground({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    ref.current?.play().catch(() => {})
  }, [src])
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const banners = slides
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startProgress = () => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100
        return p + 100 / (AUTOPLAY_MS / 50)
      })
    }, 50)
  }

  const goTo = (index: number) => {
    setActive(index)
    startProgress()
  }

  useEffect(() => {
    if (banners.length < 2 || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
      return
    }
    startProgress()
    intervalRef.current = setInterval(() => {
      setActive((a) => (a + 1) % banners.length)
      startProgress()
    }, AUTOPLAY_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [banners.length, isPaused])

  if (banners.length === 0) return null

  const banner = banners[active]
  const image = resolveImage(typeof banner.image === 'object' ? banner.image : null, 'hero')
  const theme = themeConfig[banner.theme || 'violet'] ?? themeConfig.violet

  return (
    <section
      className="relative mx-auto mt-4 max-w-[1440px] px-3 sm:px-5 lg:px-7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[82vh] max-h-[820px] min-h-[560px] overflow-hidden rounded-3xl shadow-[0_32px_100px_rgba(0,0,0,0.35)]">

        {/* ── Background: video or image ─────────────────────────────── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute inset-0"
          >
            {banner.videoUrl ? (
              <VideoBackground src={banner.videoUrl} poster={image.url} />
            ) : (
              <Image
                src={image.url}
                alt={image.alt || banner.title}
                fill
                priority={active === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}

            {/* Dark cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            {/* Subtle grid texture */}
            <div className="bg-grid absolute inset-0 opacity-[0.06]" />
          </motion.div>
        </AnimatePresence>

        {/* ── Neon glow orb behind content ──────────────────────────── */}
        <div
          className="animate-orb-drift pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full blur-[80px] opacity-25"
          style={{ background: `radial-gradient(circle, ${theme.glowColor}, transparent 65%)` }}
        />

        {/* ── Top accent stripe ──────────────────────────────────────── */}
        <div className={cn('absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r opacity-100', theme.accentBar)} />

        {/* ── HUD corner brackets ────────────────────────────────────── */}
        <div className={cn('pointer-events-none absolute left-5 top-5 h-7 w-7 border-l-2 border-t-2 rounded-tl-sm opacity-60', theme.eyebrowText, 'border-current')} />
        <div className={cn('pointer-events-none absolute right-5 top-5 h-7 w-7 border-r-2 border-t-2 rounded-tr-sm opacity-60', theme.eyebrowText, 'border-current')} />
        <div className="pointer-events-none absolute bottom-5 left-5 h-7 w-7 border-b-2 border-l-2 border-white/10 rounded-bl-sm" />
        <div className="pointer-events-none absolute bottom-5 right-5 h-7 w-7 border-b-2 border-r-2 border-white/10 rounded-br-sm" />

        {/* ── Slide content ──────────────────────────────────────────── */}
        <div className="relative z-10 flex h-full flex-col justify-end gap-5 p-8 pb-28 sm:p-12 lg:max-w-[52rem] lg:justify-center lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              {banner.eyebrow && (
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'inline-flex items-center gap-2 rounded-full border bg-black/30 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.28em] backdrop-blur-md',
                    theme.eyebrowBorder,
                  )}>
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-current" />
                    {banner.eyebrow}
                  </span>
                </div>
              )}

              <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-7xl">
                {banner.title}
              </h1>

              {banner.subtitle && (
                <p className="max-w-lg text-balance text-sm leading-relaxed text-white/65 sm:text-base lg:text-lg">
                  {banner.subtitle}
                </p>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Link
                  href={banner.ctaHref || '/shop'}
                  className={cn(
                    'group inline-flex items-center gap-2.5 rounded-2xl px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.04]',
                    'bg-gradient-to-r shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
                    theme.ctaGradient,
                    theme.ctaGradientHover,
                  )}
                >
                  <Zap size={14} className="shrink-0" />
                  {banner.ctaLabel || 'Shop now'}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-white/85 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20 hover:text-white"
                >
                  Explore all
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Slide controls & indicators ───────────────────────────── */}
        {banners.length > 1 && (
          <>
            {/* Prev / Next arrows */}
            <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-2 sm:flex">
              <button
                onClick={() => goTo((active - 1 + banners.length) % banners.length)}
                aria-label="Previous slide"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/35 text-white/80 backdrop-blur-md transition-all hover:border-white/30 hover:bg-black/55 hover:text-white hover:scale-105"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => goTo((active + 1) % banners.length)}
                aria-label="Next slide"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/35 text-white/80 backdrop-blur-md transition-all hover:border-white/30 hover:bg-black/55 hover:text-white hover:scale-105"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Progress bars + counter */}
            <div className="absolute bottom-8 left-8 z-10 flex items-end gap-4">
              <div className="flex items-center gap-1.5">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="group relative h-1 overflow-hidden rounded-full bg-white/20 transition-all duration-300"
                    style={{ width: i === active ? 48 : 20 }}
                  >
                    {i === active && (
                      <motion.div
                        className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', theme.progressBar)}
                        initial={{ width: '0%' }}
                        animate={{ width: isPaused ? `${progress}%` : `${progress}%` }}
                        transition={{ ease: 'linear', duration: 0.05 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                {String(active + 1).padStart(2, '0')}<span className="mx-1 text-white/20">/</span>{String(banners.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
