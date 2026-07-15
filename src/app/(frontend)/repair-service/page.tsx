import { BatteryCharging, Clock, Cpu, Gamepad2, Mail, MapPin, Phone, ShieldCheck, Wrench } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { RepairIllustration } from '@/components/repair/repair-illustration'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Repair Service — The Games Ocean',
  description:
    'Professional console and controller repair at The Games Ocean — joystick drift, HDMI ports, charging ports, board-level diagnostics and more. Walk in or book online.',
}

export const revalidate = 3600

const REPAIR_SERVICES = [
  {
    icon: Wrench,
    title: 'Console Repair',
    description: 'PS4, PS5, Xbox One/Series & Nintendo Switch — HDMI port, disc drive, overheating and power issues.',
  },
  {
    icon: Gamepad2,
    title: 'Controller Repair',
    description: 'Joystick drift, sticky or unresponsive buttons, cracked shells — all major controller brands.',
  },
  {
    icon: BatteryCharging,
    title: 'Charging Port & Battery',
    description: 'Worn charging ports and dead batteries replaced in controllers, handhelds and consoles.',
  },
  {
    icon: Cpu,
    title: 'Board-Level Diagnostics',
    description: 'Motherboard-level fault finding and micro-soldering for the trickier hardware problems.',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine Parts & Warranty',
    description: 'Quality replacement parts, and every repair is backed by our service warranty.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Free diagnostics on drop-off — most repairs done within 24–72 hours.',
  },
]

export default async function RepairServicePage() {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })

  const email = siteSettings?.contactEmail || 'asifmohsin646@gmail.com'
  const phone = siteSettings?.contactPhone || '+92 342 2904189'
  const address = siteSettings?.address || 'Shop # 11 Anaya Mobile Mall, Gurumandir, Karachi'
  const mapLink = siteSettings?.mapLink || 'https://maps.app.goo.gl/ZcYeKxXeASD8wkew8'
  const whatsappDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^0-9]/g, '')
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hi! I need a repair quote for my device.')}`
    : undefined

  const infoItems = [
    { icon: Mail, label: 'Email us', value: email, href: `mailto:${email}` },
    { icon: Phone, label: 'Call us', value: phone, href: `tel:${phone.replace(/\s+/g, '')}` },
    { icon: MapPin, label: 'Visit our shop', value: address, href: mapLink, external: true },
    { icon: Clock, label: 'Support hours', value: '7 days a week, 10am – 10pm PKT' },
  ]

  return (
    <div className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-30" />

      {/* Banner */}
      <section className="mx-auto max-w-[1440px] px-4 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-[0_8px_48px_rgba(0,0,0,0.08)]">
            <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-violet-glow/6 to-transparent" />

            <div
              className="animate-orb-drift pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6), transparent 70%)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full blur-3xl opacity-15"
              style={{
                background: 'radial-gradient(circle, rgba(8,145,178,0.5), transparent 70%)',
                animation: 'orb-drift 14s ease-in-out infinite 2s',
              }}
            />

            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />

            <div className="relative flex flex-col-reverse items-center gap-8 p-10 text-center sm:p-14 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:text-left">
              <div className="flex flex-col items-center gap-6 lg:max-w-[560px] lg:items-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-glow/25 bg-violet-glow/8 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-violet-glow">
                  <Wrench size={12} />
                  The Games Ocean Repair Service
                </div>
                <h1 className="text-balance max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl">
                  We don&apos;t just sell gear —{' '}
                  <span className="text-gradient">we fix it too.</span>
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
                  From joystick drift to dead HDMI ports, our in-house technicians repair consoles, controllers
                  and accessories across every major platform — with genuine parts and a warranty on every job.
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  {whatsappHref && (
                    <Button href={whatsappHref} variant="primary" size="lg">
                      Chat on WhatsApp
                    </Button>
                  )}
                  <Button href={`tel:${phone.replace(/\s+/g, '')}`} variant="secondary" size="lg">
                    Call for a quote
                  </Button>
                </div>
              </div>

              <div className="w-48 shrink-0 sm:w-60 lg:w-72">
                <RepairIllustration />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* What we repair */}
      <div className="mx-auto max-w-[1440px] px-4 pb-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we repair"
          title="Repairs we handle in-house"
          description="Bring in your device for a free diagnosis — most repairs are completed within 24–72 hours."
          align="center"
          className="mx-auto"
        />
      </div>

      <section className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPAIR_SERVICES.map((s, i) => (
            <Reveal key={s.title} index={i}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-glow/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.1)]">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-glow to-cyan-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-t-2xl" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-glow/10">
                  <s.icon size={22} className="text-violet-glow" />
                </div>
                <h3 className="font-display text-sm font-bold text-ink-900 leading-snug">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-400 transition-colors duration-300 group-hover:text-ink-600">
                  {s.description}
                </p>
                <div className="bg-dots pointer-events-none absolute inset-0 opacity-30 rounded-2xl" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact / Visit shop */}
      <div className="mx-auto max-w-[1100px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Get in touch"
            title="Book a repair or visit our shop"
            description="Reach out using the same contact details as our main store — or drop by in person and we'll take a look on the spot."
            align="center"
            className="mx-auto"
          />
          <div className="divider-glow mt-8" />
        </Reveal>

        <Reveal index={1} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {infoItems.map((item) => {
            const Content = (
              <div className="flex items-start gap-4 rounded-2xl border border-surface-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow">
                  <item.icon size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">{item.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink-900">{item.value}</p>
                </div>
              </div>
            )
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className="transition-transform hover:-translate-y-0.5"
              >
                {Content}
              </a>
            ) : (
              <div key={item.label}>{Content}</div>
            )
          })}
        </Reveal>

        <Reveal
          index={2}
          className="relative mt-10 overflow-hidden rounded-3xl border border-surface-200 bg-gradient-to-br from-surface-100 to-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-12"
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />
          <h3 className="text-balance font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Prefer to talk in person?
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink-500">
            You&apos;re welcome to visit our shop directly — bring your device in and our team will take a
            look and give you a free, no-obligation quote on the spot.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-glow to-cyan-glow px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_24px_rgba(124,58,237,0.3)] transition-all hover:scale-[1.04] hover:shadow-[0_8px_40px_rgba(124,58,237,0.45)]"
            >
              Get directions to our shop
            </Link>
            <Button href="/contact" variant="secondary" size="lg">
              Contact us
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
