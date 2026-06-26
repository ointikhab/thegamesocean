import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import React from 'react'

import { CartDrawer } from '@/components/layout/cart-drawer'
import { ChatWidget } from '@/components/layout/chat-widget'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { getPayloadClient } from '@/lib/payload'
import { Providers } from '@/providers'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NEXORA — Next-Level Gaming Gear',
    template: '%s · NEXORA',
  },
  description:
    'NEXORA is Pakistan’s premium destination for gaming consoles, accessories, and titles — PlayStation, Xbox, Nintendo Switch & PC.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()

  const [siteSettings, header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.findGlobal({ slug: 'header' }),
    payload.findGlobal({ slug: 'footer' }),
  ])

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-surface-100 font-sans text-ink-900 antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header siteSettings={siteSettings} header={header} />
            <main className="flex-1">{children}</main>
            <Footer siteSettings={siteSettings} footer={footer} />
          </div>
          <CartDrawer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
