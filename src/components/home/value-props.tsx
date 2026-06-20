import { BadgeCheck, Headset, ShieldCheck, Truck } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

const props = [
  {
    icon: Truck,
    num: '01',
    title: 'Nationwide express delivery',
    description: 'Cash on delivery across Pakistan. Orders dispatched within 24 hours, metro cities in 24–48 hrs.',
    accent: 'text-violet-glow',
    iconBg: 'bg-violet-glow/10',
    bar: 'from-violet-glow to-cyan-glow',
    hover: 'hover:border-violet-glow/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.1)]',
  },
  {
    icon: ShieldCheck,
    num: '02',
    title: '100% authentic gear',
    description: 'Every console, controller and title verified as genuine — sourced direct from authorized distributors.',
    accent: 'text-cyan-glow',
    iconBg: 'bg-cyan-glow/10',
    bar: 'from-cyan-glow to-violet-glow',
    hover: 'hover:border-cyan-glow/30 hover:shadow-[0_8px_32px_rgba(8,145,178,0.1)]',
  },
  {
    icon: BadgeCheck,
    num: '03',
    title: 'Official warranty support',
    description: 'Manufacturer-backed warranty and hassle-free returns — we handle it all locally.',
    accent: 'text-emerald-glow',
    iconBg: 'bg-emerald-glow/10',
    bar: 'from-emerald-glow to-cyan-glow',
    hover: 'hover:border-emerald-glow/30 hover:shadow-[0_8px_32px_rgba(5,150,105,0.1)]',
  },
  {
    icon: Headset,
    num: '04',
    title: 'Dedicated gamer support',
    description: 'Real humans who play what you play — reach us 7 days a week via WhatsApp, email and DM.',
    accent: 'text-magenta-glow',
    iconBg: 'bg-magenta-glow/10',
    bar: 'from-magenta-glow to-violet-glow',
    hover: 'hover:border-magenta-glow/30 hover:shadow-[0_8px_32px_rgba(219,39,119,0.1)]',
  },
]

export function ValueProps() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {props.map((p, i) => (
          <Reveal key={p.title} index={i}>
            <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 ${p.hover}`}>
              {/* Top accent bar — reveals on hover */}
              <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${p.bar} opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-t-2xl`} />

              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.iconBg} transition-all duration-300 group-hover:scale-110`}>
                  <p.icon size={22} className={`${p.accent} transition-transform duration-300 group-hover:scale-105`} />
                </div>
                <span className="font-display text-[11px] font-bold tracking-[0.25em] text-ink-300">{p.num}</span>
              </div>

              <h3 className="font-display text-sm font-bold text-ink-900 leading-snug">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-400 transition-colors duration-300 group-hover:text-ink-600">
                {p.description}
              </p>

              {/* Dot texture */}
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-30 rounded-2xl" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
