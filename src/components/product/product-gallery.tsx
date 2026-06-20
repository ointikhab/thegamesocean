'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export type GalleryImage = { url: string; alt: string }

export function ProductGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  const safeImages = images.length > 0 ? images : [{ url: '/placeholder.svg', alt: title }]
  const current = safeImages[active]

  const go = (delta: number) => {
    setActive((prev) => (prev + delta + safeImages.length) % safeImages.length)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
      {safeImages.length > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-y-auto">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border transition-all sm:w-full',
                i === active
                  ? 'border-violet-glow/70 ring-2 ring-violet-glow/30'
                  : 'border-white/8 opacity-60 hover:opacity-100',
              )}
            >
              <Image src={img.url} alt={img.alt || title} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div
        className="glass-panel group relative order-1 aspect-square flex-1 overflow-hidden rounded-3xl sm:order-2"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          setOrigin(`${x}% ${y}%`)
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={current.url}
              alt={current.alt || title}
              fill
              priority={active === 0}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 ease-out"
              style={{
                transformOrigin: origin,
                transform: zoomed ? 'scale(1.6)' : 'scale(1)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        <span className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-md transition-opacity group-hover:opacity-0">
          <ZoomIn size={16} />
        </span>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/60 group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/60 group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5">
              {safeImages.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full bg-white/40 transition-all',
                    i === active ? 'w-6 bg-white' : 'w-1.5',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
