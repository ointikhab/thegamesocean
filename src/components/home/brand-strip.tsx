import { resolveImage } from '@/lib/media'
import type { Brand } from '@/payload-types'

export function BrandStrip({ brands, heading }: { brands: Brand[]; heading?: string | null }) {
  if (brands.length === 0) return null
  const loop = [...brands, ...brands]

  return (
    <section className="relative overflow-hidden border-y border-surface-200 bg-white py-10">
      {/* Dot grid texture */}
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />

      {/* Top + bottom accent lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-glow/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/20 to-transparent" />

      <div className="relative mx-auto mb-5 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <p className="text-center font-display text-[10px] font-bold uppercase tracking-[0.4em] text-ink-300">
          {heading ?? "Trusted gear from the world’s best"}
        </p>
      </div>

      <div className="mask-fade-x relative overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 hover:[animation-play-state:paused]">
          {loop.map((brand, i) => {
            const logo = resolveImage(typeof brand.logo === 'object' ? brand.logo : null, 'thumbnail')
            return (
              <div
                key={`${brand.id}-${i}`}
                className="group flex shrink-0 items-center gap-3 opacity-35 grayscale transition-all duration-400 hover:opacity-100 hover:grayscale-0"
              >
                {logo.url && !logo.url.includes('placeholder') ? (
                  <img src={logo.url} alt={brand.name} className="h-8 w-auto object-contain" />
                ) : null}
                <span className="font-display text-lg font-bold tracking-wide text-ink-500 transition-colors duration-300 group-hover:text-ink-900">
                  {brand.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
