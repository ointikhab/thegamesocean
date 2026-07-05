import { AtSign, Globe, Mail, MapPin, MessagesSquare, Music2, Phone, PlayCircle, Send, Zap } from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/layout/logo'
import { NewsletterForm } from '@/components/layout/newsletter-form'
import type { Footer as FooterGlobal, Media, SiteSetting } from '@/payload-types'

const socialIcons: Record<string, React.ElementType> = {
  facebook: Globe,
  instagram: AtSign,
  twitter: Send,
  youtube: PlayCircle,
  tiktok: Music2,
  discord: MessagesSquare,
}

export function Footer({ siteSettings, footer }: { siteSettings: SiteSetting; footer: FooterGlobal }) {
  const columns = footer?.columns ?? []
  const logoSrc = (() => {
    const url =
      siteSettings?.logo && typeof siteSettings.logo === 'object'
        ? (siteSettings.logo as Media).url
        : null
    if (!url) return undefined
    try { return new URL(url).pathname } catch { return url }
  })()

  const email = siteSettings?.contactEmail || 'asifmohsin646@gmail.com'
  const phone = siteSettings?.contactPhone || '+92 342 2904189'
  const address = siteSettings?.address || 'Shop # 11 Anaya Mobile Mall, Gurumandir, Karachi'
  const mapLink = siteSettings?.mapLink || 'https://maps.app.goo.gl/ZcYeKxXeASD8wkew8'

  return (
    <footer className="relative mt-20 border-t border-surface-200 bg-white">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-glow/40 to-transparent" />

      {/* Dot grid texture */}
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-80 opacity-40" />

      <div className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">

        {/* Newsletter band */}
        <div className="relative mb-16 overflow-hidden rounded-3xl border border-surface-200 bg-gradient-to-br from-surface-100 to-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          {/* Left gradient bleed */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-violet-glow/6 to-transparent" />
          {/* Top accent bar */}
          <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />
          {/* Dot grid */}
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:justify-between sm:text-left lg:p-12">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-glow/25 bg-cyan-glow/8 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-glow">
                <Zap size={10} />
                Stay in the loop
              </div>
              <h3 className="text-balance font-display text-2xl font-bold text-ink-900 sm:text-3xl">
                Drops, deals & restocks —{' '}
                <span className="text-gradient">straight to your inbox.</span>
              </h3>
            </div>
            <NewsletterForm className="flex w-full max-w-md gap-2 sm:w-auto" />
          </div>
        </div>

        {/* Main footer columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Logo label={siteSettings?.storeName || 'THE GAMES OCEAN'} src={logoSrc} />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-ink-400">
              {siteSettings?.tagline || 'Next-Level Gear'} — Pakistan&apos;s premium destination for consoles, accessories
              and the latest titles across every platform.
            </p>

            <ul className="mt-5 flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-2 text-xs text-ink-400 transition-colors hover:text-ink-900"
                >
                  <Mail size={13} className="shrink-0 text-violet-glow" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="group flex items-center gap-2 text-xs text-ink-400 transition-colors hover:text-ink-900"
                >
                  <Phone size={13} className="shrink-0 text-violet-glow" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-2 text-xs text-ink-400 transition-colors hover:text-ink-900"
                >
                  <MapPin size={13} className="mt-0.5 shrink-0 text-violet-glow" />
                  <span>{address}</span>
                </a>
              </li>
            </ul>

            {siteSettings?.socialLinks?.length ? (
              <div className="mt-5 flex gap-2">
                {(siteSettings?.socialLinks ?? []).map((s) => {
                  const Icon = socialIcons[s.platform] ?? Send
                  return (
                    <a
                      key={s.platform}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 bg-white text-ink-400 shadow-sm transition-all hover:border-violet-glow/30 hover:bg-violet-glow/8 hover:text-violet-glow hover:shadow-[0_4px_16px_rgba(124,58,237,0.12)]"
                    >
                      <Icon size={15} />
                    </a>
                  )
                })}
              </div>
            ) : (
              <SocialFallback />
            )}
          </div>

          {columns.map((col) => (
            <div key={col.id ?? col.heading}>
              <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-ink-300">//</p>
              <p className="font-display text-sm font-bold text-ink-900">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {(col.links ?? []).map((link) => (
                  <li key={link.id ?? link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-ink-900"
                    >
                      <span className="h-px w-3 bg-surface-300 transition-all duration-300 group-hover:w-4 group-hover:bg-violet-glow" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-surface-200 pt-8 text-[11px] text-ink-400 sm:flex-row">
          <p>
            {footer?.bottomText ||
              `© ${new Date().getFullYear()} ${siteSettings?.storeName || 'THE GAMES OCEAN'}. All rights reserved.`}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {['Cash on Delivery', 'Visa', 'Mastercard', siteSettings?.currency || 'PKR'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-surface-200 bg-surface-100 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-ink-500"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialFallback() {
  return (
    <div className="mt-5 flex gap-2">
      {[Globe, AtSign, PlayCircle, MessagesSquare].map((Icon, i) => (
        <span
          key={i}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 bg-surface-50 text-ink-300"
        >
          <Icon size={15} />
        </span>
      ))}
    </div>
  )
}
