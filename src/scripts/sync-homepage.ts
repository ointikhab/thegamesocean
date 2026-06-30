/**
 * Populates the home-page global so the homepage looks identical to
 * the hard-coded version that existed before the CMS migration.
 *
 * Run with:  npm run payload run src/scripts/sync-homepage.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })

  // ── Fetch the same product sets the old page.tsx used ────────────
  const [latest, playstation, xbox, switchGames, accessories] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { status: { not_equals: 'draft' } },
      sort: '-createdAt',
      limit: 10,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'products',
      where: {
        and: [
          { platform: { equals: 'playstation' } },
          { status: { not_equals: 'draft' } },
        ],
      },
      sort: '-featured',
      limit: 10,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'products',
      where: {
        and: [
          { platform: { equals: 'xbox' } },
          { status: { not_equals: 'draft' } },
        ],
      },
      sort: '-featured',
      limit: 10,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'products',
      where: {
        and: [
          { platform: { equals: 'switch' } },
          { status: { not_equals: 'draft' } },
        ],
      },
      sort: '-featured',
      limit: 10,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'products',
      where: {
        and: [
          { 'category.slug': { equals: 'accessories' } },
          { status: { not_equals: 'draft' } },
        ],
      },
      sort: '-featured',
      limit: 10,
      depth: 0,
      overrideAccess: true,
    }),
  ])

  // ── Build the global document ─────────────────────────────────────
  await payload.updateGlobal({
    slug: 'home-page' as any,
    overrideAccess: true,
    data: {
      valueProps: [
        {
          icon: 'truck',
          title: 'Nationwide express delivery',
          description:
            'Cash on delivery across Pakistan. Orders dispatched within 24 hours, metro cities in 24–48 hrs.',
          accent: 'violet',
        },
        {
          icon: 'shield-check',
          title: '100% authentic gear',
          description:
            'Every console, controller and title verified as genuine — sourced direct from authorized distributors.',
          accent: 'cyan',
        },
        {
          icon: 'badge-check',
          title: 'Official warranty support',
          description:
            'Manufacturer-backed warranty and hassle-free returns — we handle it all locally.',
          accent: 'emerald',
        },
        {
          icon: 'headset',
          title: 'Dedicated gamer support',
          description:
            'Real humans who play what you play — reach us 7 days a week via WhatsApp, email and DM.',
          accent: 'magenta',
        },
      ] as any,

      latestArrivals: {
        eyebrow: 'Just dropped',
        title: 'Latest arrivals',
        description:
          'Fresh off the shelves — the newest consoles, accessories and titles to land at The Games Ocean.',
        href: '/shop?sort=newest',
        products: latest.docs.map((p) => p.id),
      },

      platformSection: {
        eyebrow: 'Shop by platform',
        title: 'Built for your setup, whatever it is.',
        description:
          'From living-room consoles to full PC battle-stations — find gear matched to your platform.',
        cards: [
          {
            label: 'PlayStation',
            eyebrow: 'PS5 & PS4',
            description: 'DualSense haptics, console exclusives and next-gen hardware.',
            href: '/shop?platform=playstation',
            platform: 'playstation',
            tag: 'Most Popular',
          },
          {
            label: 'Xbox',
            eyebrow: 'Series X|S',
            description: 'Game Pass, Elite controllers and Xbox exclusives at speed.',
            href: '/shop?platform=xbox',
            platform: 'xbox',
          },
          {
            label: 'Nintendo Switch',
            eyebrow: 'Switch & OLED',
            description: 'Joy-Cons, OLED model and every must-have Nintendo title.',
            href: '/shop?platform=switch',
            platform: 'switch',
          },
          {
            label: 'PC Gaming',
            eyebrow: 'Peripherals',
            description: 'Mechanical keyboards, precision mice, headsets and racing wheels.',
            href: '/shop?platform=pc',
            platform: 'pc',
          },
        ],
      } as any,

      platformRails: [
        {
          eyebrow: 'PlayStation',
          title: 'For your PS5 & PS4 setup',
          href: '/shop?platform=playstation',
          products: playstation.docs.map((p) => p.id),
        },
        {
          eyebrow: 'Xbox',
          title: 'Series X|S essentials',
          href: '/shop?platform=xbox',
          products: xbox.docs.map((p) => p.id),
        },
        {
          eyebrow: 'Nintendo Switch',
          title: 'Handheld & party favourites',
          href: '/shop?platform=switch',
          products: switchGames.docs.map((p) => p.id),
        },
      ],

      brandStripHeading: "Trusted gear from the world's best",

      promoBand: {
        eyebrow: 'Trade-in & upgrade',
        title: 'Got old gear? Trade it in for instant credit.',
        subtitle:
          'Consoles, controllers and headsets accepted. Get an instant valuation online or in-store and roll it straight into your next order — no hassle, no waiting.',
        tags: [
          { label: 'Instant valuation' },
          { label: 'Same-day credit' },
          { label: 'Any condition' },
        ],
        primaryCtaLabel: 'Get a valuation',
        primaryCtaHref: '/contact',
        secondaryCtaLabel: 'Browse all products',
        secondaryCtaHref: '/shop',
      },

      categoryRails: [
        {
          eyebrow: 'Accessories',
          title: 'Level up your loadout',
          description:
            'Controllers, headsets, racing wheels and more — engineered for competitive edge.',
          href: '/shop?category=accessories',
          products: accessories.docs.map((p) => p.id),
        },
      ],
    } as any,
  })

  payload.logger.info(`✅  home-page global updated`)
  payload.logger.info(`   Latest arrivals : ${latest.docs.length} products`)
  payload.logger.info(`   PlayStation rail: ${playstation.docs.length} products`)
  payload.logger.info(`   Xbox rail       : ${xbox.docs.length} products`)
  payload.logger.info(`   Switch rail     : ${switchGames.docs.length} products`)
  payload.logger.info(`   Accessories rail: ${accessories.docs.length} products`)
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
