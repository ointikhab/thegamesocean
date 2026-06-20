import { ArrowUpRight, Gamepad2, Joystick, Monitor, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils'

const platforms = [
  {
    label: 'PlayStation',
    eyebrow: 'PS5 & PS4',
    href: '/shop?platform=playstation',
    description: 'DualSense haptics, console exclusives and next-gen hardware.',
    icon: Gamepad2,
    bg: 'from-violet-glow/8 to-violet-glow/3',
    accent: '#7c3aed',
    accentCls: 'text-violet-glow',
    bar: 'from-violet-glow to-purple-400',
    border: 'hover:border-violet-glow/40',
    shadow: 'hover:shadow-[0_16px_48px_rgba(124,58,237,0.15)]',
    tag: 'Most Popular',
    tagCls: 'bg-violet-glow text-white',
  },
  {
    label: 'Xbox',
    eyebrow: 'Series X|S',
    href: '/shop?platform=xbox',
    description: 'Game Pass, Elite controllers and Xbox exclusives at speed.',
    icon: Joystick,
    bg: 'from-emerald-glow/8 to-emerald-glow/3',
    accent: '#059669',
    accentCls: 'text-emerald-glow',
    bar: 'from-emerald-glow to-green-400',
    border: 'hover:border-emerald-glow/40',
    shadow: 'hover:shadow-[0_16px_48px_rgba(5,150,105,0.12)]',
    tag: null,
    tagCls: '',
  },
  {
    label: 'Nintendo Switch',
    eyebrow: 'Switch & OLED',
    href: '/shop?platform=switch',
    description: 'Joy-Cons, OLED model and every must-have Nintendo title.',
    icon: Sparkles,
    bg: 'from-magenta-glow/8 to-magenta-glow/3',
    accent: '#db2777',
    accentCls: 'text-magenta-glow',
    bar: 'from-magenta-glow to-rose-400',
    border: 'hover:border-magenta-glow/40',
    shadow: 'hover:shadow-[0_16px_48px_rgba(219,39,119,0.12)]',
    tag: null,
    tagCls: '',
  },
  {
    label: 'PC Gaming',
    eyebrow: 'Peripherals',
    href: '/shop?platform=pc',
    description: 'Mechanical keyboards, precision mice, headsets and racing wheels.',
    icon: Monitor,
    bg: 'from-cyan-glow/8 to-cyan-glow/3',
    accent: '#0891b2',
    accentCls: 'text-cyan-glow',
    bar: 'from-cyan-glow to-sky-400',
    border: 'hover:border-cyan-glow/40',
    shadow: 'hover:shadow-[0_16px_48px_rgba(8,145,178,0.12)]',
    tag: null,
    tagCls: '',
  },
]

export function PlatformGrid() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Shop by platform"
          title="Built for your setup, whatever it is."
          description="From living-room consoles to full PC battle-stations — find gear matched to your platform."
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platforms.map((p, i) => (
          <Reveal key={p.label} index={i}>
            <Link
              href={p.href}
              className={cn(
                'group relative flex h-64 flex-col overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br transition-all duration-400 hover:-translate-y-1.5',
                p.bg, p.border, p.shadow,
                'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
              )}
            >
              {/* Top accent bar */}
              <div className={cn('h-[3px] w-full bg-gradient-to-r', p.bar)} />

              {/* Dot grid */}
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" />

              {/* Expanding glow orb bottom-right */}
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full blur-2xl opacity-0 transition-all duration-500 group-hover:opacity-70 group-hover:-bottom-4 group-hover:-right-4"
                style={{ background: `radial-gradient(circle, ${p.accent}66, transparent 70%)` }}
              />

              <div className="relative flex flex-1 flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-13 w-13 items-center justify-center rounded-xl border border-surface-200 bg-white shadow-sm transition-all duration-400 group-hover:scale-110 group-hover:shadow-md"
                    style={{ boxShadow: undefined }}
                  >
                    <p.icon size={24} className={cn(p.accentCls, 'transition-transform duration-400 group-hover:scale-105')} />
                  </div>
                  {p.tag && (
                    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-widest', p.tagCls)}>
                      {p.tag}
                    </span>
                  )}
                </div>

                <div>
                  <p className={cn('mb-1 font-display text-[10px] font-bold uppercase tracking-[0.28em]', p.accentCls)}>
                    {p.eyebrow}
                  </p>
                  <h3 className="font-display text-xl font-bold text-ink-900">
                    {p.label}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-400 transition-colors duration-300 group-hover:text-ink-600">
                    {p.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className={cn('font-display text-[11px] font-bold uppercase tracking-wider', p.accentCls)}>
                      Shop now
                    </span>
                    <ArrowUpRight size={13} className={p.accentCls} />
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
