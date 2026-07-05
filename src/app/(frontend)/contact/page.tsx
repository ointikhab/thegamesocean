import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/contact-form'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Contact Us — The Games Ocean',
  description: 'Get in touch with The Games Ocean team — order questions, product help, or partnership enquiries.',
}

export const revalidate = 3600

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })

  const email = siteSettings?.contactEmail || 'asifmohsin646@gmail.com'
  const phone = siteSettings?.contactPhone || '+92 342 2904189'
  const address = siteSettings?.address || 'Shop # 11 Anaya Mobile Mall, Gurumandir, Karachi'
  const mapLink = siteSettings?.mapLink || 'https://maps.app.goo.gl/ZcYeKxXeASD8wkew8'

  const infoItems = [
    { icon: Mail, label: 'Email us', value: email, href: `mailto:${email}` },
    { icon: Phone, label: 'Call us', value: phone, href: `tel:${phone.replace(/\s+/g, '')}` },
    { icon: MapPin, label: 'Visit us', value: address, href: mapLink, external: true },
    { icon: Clock, label: 'Support hours', value: '7 days a week, 10am – 10pm PKT' },
  ]

  return (
    <div className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-30" />

      <div className="mx-auto max-w-[1100px] px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Get in touch"
            title="We'd love to hear from you."
            description="Questions about an order, a product, or a partnership? Send us a message and our team will reply within 24 hours."
            align="center"
            className="mx-auto"
          />
          <div className="divider-glow mt-8" />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
          {/* Info column */}
          <Reveal index={1} className="flex flex-col gap-4">
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

          {/* Form column */}
          <Reveal index={2} className="rounded-3xl border border-surface-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
