'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import Image from 'next/image'

function extractVideoId(url: string): string | null {
  if (!url) return null
  // Already a bare ID (11 chars, alphanumeric + - _)
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim()
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([\w-]{11})/)
  if (short) return short[1]
  // youtube.com/watch?v=ID or /embed/ID or /shorts/ID
  const long = url.match(/(?:v=|\/embed\/|\/shorts\/)([\w-]{11})/)
  if (long) return long[1]
  return null
}

export function YouTubeEmbed({ url }: { url: string }) {
  const videoId = extractVideoId(url)
  const [playing, setPlaying] = useState(false)

  if (!videoId) return null

  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-black shadow-sm">
      {playing ? (
        <div className="aspect-video w-full">
          <iframe
            src={embedSrc}
            title="Product video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden"
          aria-label="Play product video"
        >
          {/* Thumbnail */}
          <Image
            src={thumb}
            alt="Product video thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />

          {/* Play button */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_32px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_48px_rgba(0,0,0,0.5)]">
            <Play size={24} className="translate-x-0.5 fill-red-600 text-red-600" />
          </div>

          {/* YouTube badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-red-500">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z"/>
            </svg>
            <span className="font-display text-[11px] font-bold text-white">Watch video</span>
          </div>
        </button>
      )}
    </div>
  )
}
