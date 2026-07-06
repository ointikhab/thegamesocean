import type { Metadata } from 'next'
import { Gamepad2, MapPinned, ShieldCheck, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { ValueProps } from '@/components/home/value-props'

export const metadata: Metadata = {
  title: 'About Us — The Games Ocean',
  description:
    "Learn about The Games Ocean — Pakistan's premium destination for gaming consoles, accessories and titles across every platform.",
}

const STATS = [
  { icon: Gamepad2, label: 'Platforms supported', value: '3+' },
  { icon: Users, label: 'Happy gamers served', value: '50,000+' },
  { icon: MapPinned, label: 'Cities delivered to', value: '80+' },
  { icon: ShieldCheck, label: '100% authentic gear', value: 'Always' },
]

export default function AboutPage() {
  return (
    <div className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-30" />

      <div className="mx-auto max-w-[1000px] px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our story"
            title="Built by gamers, for gamers."
            description="The Games Ocean is Pakistan's premium destination for gaming consoles, accessories and the latest titles — across PlayStation, Xbox, Nintendo Switch and PC."
            align="center"
            className="mx-auto"
          />
          <div className="divider-glow mt-8" />
        </Reveal>

        {/* Story */}
        <Reveal index={1} className="mx-auto mt-12 max-w-2xl space-y-4 text-sm leading-relaxed text-ink-500">
          <p>
            We started The Games Ocean out of a simple frustration: finding genuine, fairly-priced gaming gear
            in Pakistan shouldn&apos;t be a gamble. Too many gamers were stuck choosing between grey-market
            imports of uncertain origin or waiting weeks for international shipping.
          </p>
          <p>
            Today, we work directly with authorized distributors to bring consoles, controllers, headsets and
            day-one titles to gamers in every corner of the country — backed by real warranty support, fast
            nationwide delivery and a support team that actually plays what you play.
          </p>
          <p>
            Whether you&apos;re building your first setup or hunting down the next must-have exclusive, our goal
            is the same: get you playing, faster, with zero compromises on authenticity.
          </p>
        </Reveal>

        {/* Stats */}
        <Reveal index={2} className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-surface-200 bg-white px-4 py-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <s.icon size={20} className="text-violet-glow" />
              <p className="font-display text-xl font-extrabold text-ink-900">{s.value}</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">{s.label}</p>
            </div>
          ))}
        </Reveal>

        {/* Why choose us */}
        <div className="mt-16">
          <SectionHeading eyebrow="Why choose us" title="What sets us apart" align="center" className="mx-auto" />
        </div>
      </div>

      <ValueProps
        items={[
          {
            icon: 'truck',
            title: 'Nationwide express delivery',
            description: 'Cash on delivery across Pakistan. Orders dispatched within 24 hours, metro cities in 24–48 hrs.',
            accent: 'violet',
          },
          {
            icon: 'shield-check',
            title: '100% authentic gear',
            description: 'Every console, controller and title verified as genuine — sourced direct from authorized distributors.',
            accent: 'cyan',
          },
          {
            icon: 'badge-check',
            title: 'Official warranty support',
            description: 'Manufacturer-backed warranty and hassle-free returns — we handle it all locally.',
            accent: 'emerald',
          },
          {
            icon: 'headset',
            title: 'Dedicated gamer support',
            description: 'Real humans who play what you play — reach us 7 days a week via WhatsApp, email and DM.',
            accent: 'magenta',
          },
        ]}
      />

      {/* CTA band */}
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative mt-4 overflow-hidden rounded-3xl border border-surface-200 bg-gradient-to-br from-surface-100 to-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-12">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />
            <h3 className="text-balance font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              Ready to level up your setup?
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-ink-500">
              Browse our full catalog or get in touch — our team is here to help you find the right gear.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href="/shop" variant="primary" size="lg">Shop now</Button>
              <Button href="/contact" variant="secondary" size="lg">Contact us</Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
