import { BadgeCheck, Headset, ShieldCheck, Truck, Zap } from 'lucide-react'
import type { ElementType } from 'react'

import { Reveal } from '@/components/ui/reveal'

export type ValuePropItem = {
  icon: string
  title: string
  description: string
  accent: string
}

const iconMap: Record<string, ElementType> = {
  truck: Truck,
  'shield-check': ShieldCheck,
  'badge-check': BadgeCheck,
  headset: Headset,
  zap: Zap,
}

const accentMap: Record<string, { text: string; iconBg: string; bar: string; hover: string }> = {
  violet: {
    text: 'text-violet-glow',
    iconBg: 'bg-violet-glow/10',
    bar: 'from-violet-glow to-cyan-glow',
    hover: 'hover:border-violet-glow/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.1)]',
  },
  cyan: {
    text: 'text-cyan-glow',
    iconBg: 'bg-cyan-glow/10',
    bar: 'from-cyan-glow to-violet-glow',
    hover: 'hover:border-cyan-glow/30 hover:shadow-[0_8px_32px_rgba(8,145,178,0.1)]',
  },
  emerald: {
    text: 'text-emerald-glow',
    iconBg: 'bg-emerald-glow/10',
    bar: 'from-emerald-glow to-cyan-glow',
    hover: 'hover:border-emerald-glow/30 hover:shadow-[0_8px_32px_rgba(5,150,105,0.1)]',
  },
  magenta: {
    text: 'text-magenta-glow',
    iconBg: 'bg-magenta-glow/10',
    bar: 'from-magenta-glow to-violet-glow',
    hover: 'hover:border-magenta-glow/30 hover:shadow-[0_8px_32px_rgba(219,39,119,0.1)]',
  },
}

export function ValueProps({ items }: { items: ValuePropItem[] }) {
  if (!items.length) return null

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => {
          const Icon = iconMap[p.icon] ?? Truck
          const a = accentMap[p.accent] ?? accentMap.violet

          return (
            <Reveal key={p.title} index={i}>
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 ${a.hover}`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${a.bar} opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-t-2xl`}
                />

                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.iconBg} transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon
                      size={22}
                      className={`${a.text} transition-transform duration-300 group-hover:scale-105`}
                    />
                  </div>
                  <span className="font-display text-[11px] font-bold tracking-[0.25em] text-ink-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-display text-sm font-bold text-ink-900 leading-snug">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-400 transition-colors duration-300 group-hover:text-ink-600">
                  {p.description}
                </p>

                <div className="bg-dots pointer-events-none absolute inset-0 opacity-30 rounded-2xl" />
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
