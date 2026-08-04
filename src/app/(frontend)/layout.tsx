import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { AnnouncementTicker } from '@/components/layout/announcement-ticker'
import { CartDrawer } from '@/components/layout/cart-drawer'
import { ChatWidget } from '@/components/layout/chat-widget'
import { CustomScripts } from '@/components/layout/custom-scripts'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { getPayloadClient } from '@/lib/payload'
import { Providers } from '@/providers'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The Games Ocean — Next-Level Gaming Gear',
    template: '%s · The Games Ocean',
  },
  description:
    'The Games Ocean is Pakistan’s premium destination for gaming consoles, accessories, and titles — PlayStation, Xbox, Nintendo Switch & PC.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()

  const [siteSettings, header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    payload.findGlobal({ slug: 'header' }),
    payload.findGlobal({ slug: 'footer' }),
  ])

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface-100 font-sans text-ink-900 antialiased" suppressHydrationWarning>
        <CustomScripts html={siteSettings.headerCode} target="head" />
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header siteSettings={siteSettings} header={header} />
            <AnnouncementTicker siteSettings={siteSettings} />
            <main className="flex-1">{children}</main>
            <Footer siteSettings={siteSettings} footer={footer} />
          </div>
          <CartDrawer />
          <ChatWidget />
          <WhatsAppButton />
        </Providers>
        <CustomScripts html={siteSettings.footerCode} target="body" />
      </body>
    </html>
  )
}
