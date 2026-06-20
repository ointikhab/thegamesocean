import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'

export function PromoBand() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-[0_8px_48px_rgba(0,0,0,0.08)]">
          {/* Dot grid */}
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" />

          {/* Left colour bleed */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-violet-glow/6 to-transparent" />

          {/* Floating glow orbs */}
          <div
            className="animate-orb-drift pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6), transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.5), transparent 70%)', animation: 'orb-drift 14s ease-in-out infinite 2s' }}
          />

          {/* Top accent stripe */}
          <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />

          {/* Content */}
          <div className="relative flex flex-col items-start gap-8 p-10 sm:p-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-magenta-glow/25 bg-magenta-glow/8 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-magenta-glow">
                <Zap size={10} />
                Trade-in & upgrade
              </div>
              <h2 className="text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                Got old gear?{' '}
                <span className="text-gradient">Trade it in</span>{' '}
                for instant credit.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">
                Consoles, controllers and headsets accepted. Get an instant valuation online or in-store and roll it
                straight into your next order — no hassle, no waiting.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {['Instant valuation', 'Same-day credit', 'Any condition'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-surface-300 bg-surface-100 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-ink-600"
                  >
                    <span className="h-1 w-1 rounded-full bg-cyan-glow" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-glow to-cyan-glow px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_24px_rgba(124,58,237,0.3)] transition-all hover:scale-[1.04] hover:shadow-[0_8px_40px_rgba(124,58,237,0.45)]"
              >
                Get a valuation
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-surface-300 bg-white px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-ink-600 shadow-sm transition-all hover:border-surface-400 hover:shadow-md hover:text-ink-900"
              >
                Browse all products
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
