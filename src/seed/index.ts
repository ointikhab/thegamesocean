import { getPayload, type Payload } from 'payload'

import config from '@payload-config'

import { generateArtwork } from './generate-artwork'
import { PRODUCT_IMAGES } from './product-images'
import {
  bannersData,
  brandsData,
  categoriesData,
  customersData,
  pagesData,
  productsData,
  reviewsData,
  type SeedProduct,
} from './data'

const ART_SIZE = 1000

function paragraphsToLexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  }
}

const CLOSING_COPY: Record<'console' | 'game' | 'accessory', string> = {
  console:
    "Every console ships sealed and region-checked, backed by The Games Ocean's 14-day replacement guarantee and the full manufacturer warranty — genuine hardware, honoured locally.",
  game: 'Sourced exclusively from authorized regional distributors — genuine, region-compatible, and ready to drop straight into your library.',
  accessory:
    'Validated on our in-house QA bench for comfort, durability and competitive-grade performance — engineered for marathon sessions and ranked nights alike.',
}

function productKind(p: SeedProduct): 'console' | 'game' | 'accessory' {
  if (p.categories.includes('consoles')) return 'console'
  if (p.categories.includes('games')) return 'game'
  return 'accessory'
}

function buildSpecs(p: SeedProduct): { label: string; value: string }[] {
  const kind = productKind(p)
  if (kind === 'console') {
    return [
      { label: 'Storage', value: '1TB NVMe SSD (expandable)' },
      { label: 'Resolution', value: 'Up to 4K @ 120Hz, 8K-ready output' },
      { label: 'Connectivity', value: 'Wi-Fi 6, Bluetooth 5.1, Gigabit Ethernet' },
      { label: 'In the box', value: 'Console, controller, HDMI 2.1 cable, power cable' },
    ]
  }
  if (kind === 'game') {
    return [
      { label: 'Genre', value: 'Action / Adventure' },
      { label: 'Players', value: 'Single-player campaign with online modes' },
      { label: 'Format', value: 'Physical disc / digital code' },
      { label: 'Region', value: 'Region-free — plays on any console of its platform' },
    ]
  }
  return [
    { label: 'Connectivity', value: 'Wireless 2.4GHz + Bluetooth + USB-C wired' },
    { label: 'Battery life', value: 'Up to 30 hours per charge' },
    { label: 'Compatibility', value: 'PC, console & mobile' },
    { label: 'Warranty', value: '1-year manufacturer warranty, honoured locally' },
  ]
}

async function clearAll(payload: Payload) {
  // Globals can hold relationships into `media`; clear them first so the
  // media delete below doesn't hit a foreign-key violation (which Postgres
  // then reports as a confusing "transaction aborted" error on whatever
  // query runs next).
  await payload.updateGlobal({ slug: 'home-page' as any, data: { heroSlides: [] }, overrideAccess: true })
  await payload.updateGlobal({ slug: 'site-settings', data: { logo: null }, overrideAccess: true })

  const order = [
    'orders',
    'reviews',
    'products',
    'banners',
    'pages',
    'categories',
    'brands',
    'customers',
    'users',
    'media',
  ] as const

  for (const slug of order) {
    await payload.delete({ collection: slug, where: { id: { exists: true } }, overrideAccess: true })
  }
}

async function uploadArt(payload: Payload, alt: string, seedKey: string) {
  const buffer = await generateArtwork(seedKey, ART_SIZE)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: 'image/png',
      name: `${seedKey}.png`,
      size: buffer.length,
    },
    overrideAccess: true,
  })
}

async function uploadFromUrl(payload: Payload, url: string, alt: string, filename: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : contentType.includes('avif') ? 'jpg' : 'jpg'
    return payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype: contentType.split(';')[0] as string,
        name: `${filename}.${ext}`,
        size: buffer.length,
      },
      overrideAccess: true,
    })
  } catch {
    // fall back to generated art if download fails
    return uploadArt(payload, alt, filename)
  }
}

async function uploadProductImages(payload: Payload, p: SeedProduct) {
  const urls = PRODUCT_IMAGES[p.slug] ?? p.images ?? []
  if (urls.length > 0) {
    return Promise.all(
      urls.slice(0, 3).map((url, i) =>
        uploadFromUrl(payload, url, `${p.title} — view ${i + 1}`, `${p.slug}-${i + 1}`),
      ),
    )
  }
  // No real images available — generate abstract art
  return Promise.all(
    [1, 2].map((n) => uploadArt(payload, `${p.title} — view ${n}`, `${p.slug}-${n}`)),
  )
}

async function run() {
  const payload = await getPayload({ config })

  payload.logger.info('🌱  Clearing existing The Games Ocean data…')
  await clearAll(payload)

  // ---------------------------------------------------------------------
  // Brands
  // ---------------------------------------------------------------------
  payload.logger.info('🏷️   Seeding brands…')
  const brandIdBySlug = new Map<string, string | number>()
  for (const brand of brandsData) {
    const logo = await uploadArt(payload, `${brand.name} logo`, `brand-${brand.slug}`)
    const doc = await payload.create({
      collection: 'brands',
      data: { name: brand.name, slug: brand.slug, description: brand.description, logo: logo.id },
      overrideAccess: true,
    })
    brandIdBySlug.set(brand.slug, doc.id)
  }

  // ---------------------------------------------------------------------
  // Categories (two passes so `parent` self-relations resolve cleanly)
  // ---------------------------------------------------------------------
  payload.logger.info('🗂️   Seeding categories…')
  const categoryIdBySlug = new Map<string, string | number>()
  for (const cat of categoriesData) {
    const doc = await payload.create({
      collection: 'categories',
      data: {
        name: cat.name,
        slug: cat.slug,
        platform: cat.platform,
        description: cat.description,
        showInNav: cat.showInNav ?? true,
        navOrder: cat.navOrder ?? 0,
      },
      overrideAccess: true,
    })
    categoryIdBySlug.set(cat.slug, doc.id)
  }
  for (const cat of categoriesData) {
    if (!cat.parent) continue
    const id = categoryIdBySlug.get(cat.slug)
    const parentId = categoryIdBySlug.get(cat.parent)
    if (!id || !parentId) continue
    await payload.update({ collection: 'categories', id, data: { parent: parentId as number }, overrideAccess: true })
  }

  // ---------------------------------------------------------------------
  // Products
  // ---------------------------------------------------------------------
  payload.logger.info('🎮  Seeding products (this generates artwork — may take a minute)…')
  const productIdBySlug = new Map<string, string | number>()
  for (const p of productsData) {
    const categoryIds = p.categories.map((slug) => categoryIdBySlug.get(slug)).filter(Boolean)
    const brandId = brandIdBySlug.get(p.brand)

    const images = await uploadProductImages(payload, p)

    const doc = await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        slug: p.slug,
        status: p.status ?? 'active',
        featured: p.featured ?? false,
        platform: p.platform,
        category: categoryIds as number[],
        brand: brandId as number,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        shortDescription: p.shortDescription,
        note: p.note,
        youtubeUrl: p.youtubeUrl,
        description: paragraphsToLexical([p.shortDescription, CLOSING_COPY[productKind(p)]]),
        images: images.map((img) => ({ image: img.id })),
        specs: buildSpecs(p),
        variants: p.variants
          ? await Promise.all(
              p.variants.map(async (v) => {
                let variantImageId: number | undefined
                if (v.imageUrl) {
                  try {
                    const img = await uploadFromUrl(
                      payload,
                      v.imageUrl,
                      `${p.title} — ${v.label}`,
                      `${p.slug}-variant-${v.sku ?? v.label.toLowerCase().replace(/\s+/g, '-')}`,
                    )
                    variantImageId = img.id as number
                  } catch {
                    // fall through — no variant image
                  }
                }
                return {
                  label: v.label,
                  sku: v.sku,
                  price: v.price,
                  compareAtPrice: v.compareAtPrice,
                  stock: v.stock,
                  ...(variantImageId ? { image: variantImageId } : {}),
                }
              }),
            )
          : undefined,
      },
      overrideAccess: true,
    })
    productIdBySlug.set(p.slug, doc.id)
  }

  // ---------------------------------------------------------------------
  // Banners + slide images
  // ---------------------------------------------------------------------
  payload.logger.info('🖼️   Seeding banners…')
  const slideImageIds: number[] = []
  for (const b of bannersData) {
    const image = await uploadArt(payload, b.title, b.seedKey)
    slideImageIds.push(image.id as number)
    await payload.create({
      collection: 'banners',
      data: {
        eyebrow: b.eyebrow,
        title: b.title,
        subtitle: b.subtitle,
        image: image.id,
        ctaLabel: b.ctaLabel,
        ctaHref: b.ctaHref,
        theme: b.theme,
        order: b.order,
        active: true,
      },
      overrideAccess: true,
    })
  }

  // ---------------------------------------------------------------------
  // Pages
  // ---------------------------------------------------------------------
  payload.logger.info('📄  Seeding pages…')
  for (const page of pagesData) {
    await payload.create({
      collection: 'pages',
      data: { title: page.title, slug: page.slug, content: paragraphsToLexical(page.paragraphs) },
      overrideAccess: true,
    })
  }

  // ---------------------------------------------------------------------
  // Admin user
  // ---------------------------------------------------------------------
  payload.logger.info('🔑  Seeding admin user…')
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@thegamesocean.com',
      password: 'GamesOceanAdmin#2026',
      name: 'The Games Ocean Admin',
      role: 'admin',
    },
    overrideAccess: true,
  })

  // ---------------------------------------------------------------------
  // Customers
  // ---------------------------------------------------------------------
  payload.logger.info('🧑‍🤝‍🧑  Seeding customers…')
  const customerIdByEmail = new Map<string, string | number>()
  for (const c of customersData) {
    const doc = await payload.create({
      collection: 'customers',
      data: {
        email: c.email,
        password: c.password,
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
        addresses: c.addresses,
      },
      overrideAccess: true,
    })
    customerIdByEmail.set(c.email, doc.id)
  }

  // ---------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------
  payload.logger.info('⭐  Seeding reviews…')
  for (const r of reviewsData) {
    const productId = productIdBySlug.get(r.productSlug)
    const customerId = customerIdByEmail.get(r.customerEmail)
    if (!productId || !customerId) continue
    await payload.create({
      collection: 'reviews',
      data: {
        product: productId as number,
        customer: customerId as number,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        approved: true,
      },
      overrideAccess: true,
    })
  }

  // ---------------------------------------------------------------------
  // Sample orders (give the seeded customers an order history to view)
  // ---------------------------------------------------------------------
  payload.logger.info('📦  Seeding sample orders…')
  const ayeshaId = customerIdByEmail.get('ayesha.khan@example.com')
  const hamzaId = customerIdByEmail.get('hamza.raza@example.com')
  const ayesha = customersData[0]
  const hamza = customersData[1]

  const dualsense = productsData.find((p) => p.slug === 'dualsense-wireless-controller')!
  const spiderman = productsData.find((p) => p.slug === 'marvels-spider-man-2-ps5')!
  const xboxPad = productsData.find((p) => p.slug === 'xbox-wireless-controller')!
  const switchOled = productsData.find((p) => p.slug === 'nintendo-switch-oled-model')!

  if (ayeshaId) {
    const items = [
      {
        product: productIdBySlug.get(dualsense.slug) as number,
        titleSnapshot: dualsense.title,
        variantLabel: 'Cosmic Red',
        quantity: 1,
        unitPrice: 19999,
        lineTotal: 19999,
      },
      {
        product: productIdBySlug.get(spiderman.slug) as number,
        titleSnapshot: spiderman.title,
        quantity: 1,
        unitPrice: spiderman.price,
        lineTotal: spiderman.price,
      },
    ]
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
    await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'NEX-100231',
        status: 'delivered',
        paymentMethod: 'cod',
        customer: ayeshaId as number,
        items,
        subtotal,
        shippingCost: 0,
        total: subtotal,
        shippingAddress: {
          fullName: ayesha.addresses[0].fullName,
          phone: ayesha.addresses[0].phone,
          email: ayesha.email,
          line1: ayesha.addresses[0].line1,
          line2: ayesha.addresses[0].line2,
          city: ayesha.addresses[0].city,
          province: ayesha.addresses[0].province,
          postalCode: ayesha.addresses[0].postalCode,
          country: ayesha.addresses[0].country,
        },
        notes: 'Please call before delivery — gate code required.',
      },
      overrideAccess: true,
    })

    const items2 = [
      {
        product: productIdBySlug.get(switchOled.slug) as number,
        titleSnapshot: switchOled.title,
        quantity: 1,
        unitPrice: switchOled.price,
        lineTotal: switchOled.price,
      },
    ]
    const subtotal2 = items2.reduce((sum, i) => sum + i.lineTotal, 0)
    await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'NEX-100255',
        status: 'processing',
        paymentMethod: 'cod',
        customer: ayeshaId as number,
        items: items2,
        subtotal: subtotal2,
        shippingCost: 0,
        total: subtotal2,
        shippingAddress: {
          fullName: ayesha.addresses[0].fullName,
          phone: ayesha.addresses[0].phone,
          email: ayesha.email,
          line1: ayesha.addresses[0].line1,
          line2: ayesha.addresses[0].line2,
          city: ayesha.addresses[0].city,
          province: ayesha.addresses[0].province,
          postalCode: ayesha.addresses[0].postalCode,
          country: ayesha.addresses[0].country,
        },
      },
      overrideAccess: true,
    })
  }

  if (hamzaId) {
    const items = [
      {
        product: productIdBySlug.get(xboxPad.slug) as number,
        titleSnapshot: xboxPad.title,
        variantLabel: 'Robot White',
        quantity: 2,
        unitPrice: xboxPad.price,
        lineTotal: xboxPad.price * 2,
      },
    ]
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
    const shippingCost = 0
    await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'NEX-100278',
        status: 'shipped',
        paymentMethod: 'cod',
        customer: hamzaId as number,
        items,
        subtotal,
        shippingCost,
        total: subtotal + shippingCost,
        shippingAddress: {
          fullName: hamza.addresses[0].fullName,
          phone: hamza.addresses[0].phone,
          email: hamza.email,
          line1: hamza.addresses[0].line1,
          line2: hamza.addresses[0].line2,
          city: hamza.addresses[0].city,
          province: hamza.addresses[0].province,
          postalCode: hamza.addresses[0].postalCode,
          country: hamza.addresses[0].country,
        },
      },
      overrideAccess: true,
    })
  }

  // ---------------------------------------------------------------------
  // Globals — HomePage
  // ---------------------------------------------------------------------
  payload.logger.info('🏠  Seeding home page global…')

  const latestIds = productsData
    .slice(0, 10)
    .map((p) => productIdBySlug.get(p.slug))
    .filter(Boolean)

  const psIds = productsData
    .filter((p) => p.platform === 'playstation')
    .slice(0, 10)
    .map((p) => productIdBySlug.get(p.slug))
    .filter(Boolean)

  const xboxIds = productsData
    .filter((p) => p.platform === 'xbox')
    .slice(0, 10)
    .map((p) => productIdBySlug.get(p.slug))
    .filter(Boolean)

  const switchIds = productsData
    .filter((p) => p.platform === 'switch')
    .slice(0, 10)
    .map((p) => productIdBySlug.get(p.slug))
    .filter(Boolean)

  const accessoryIds = productsData
    .filter((p) => p.platform === 'pc' || p.platform === 'universal')
    .slice(0, 10)
    .map((p) => productIdBySlug.get(p.slug))
    .filter(Boolean)

  await payload.updateGlobal({
    slug: 'home-page' as any,
    data: {
      heroSlides: bannersData.map((b, i) => ({
        eyebrow: b.eyebrow,
        title: b.title,
        subtitle: b.subtitle,
        image: slideImageIds[i],
        ctaLabel: b.ctaLabel,
        ctaHref: b.ctaHref,
        theme: b.theme,
      })),
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
      ],
      latestArrivals: {
        eyebrow: 'Just dropped',
        title: 'Latest arrivals',
        description:
          'Fresh off the shelves — the newest consoles, accessories and titles to land at The Games Ocean.',
        href: '/shop?sort=newest',
        products: latestIds,
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
      },
      platformRails: [
        {
          eyebrow: 'PlayStation',
          title: 'For your PS5 & PS4 setup',
          href: '/shop?platform=playstation',
          products: psIds,
        },
        {
          eyebrow: 'Xbox',
          title: 'Series X|S essentials',
          href: '/shop?platform=xbox',
          products: xboxIds,
        },
        {
          eyebrow: 'Nintendo Switch',
          title: 'Handheld & party favourites',
          href: '/shop?platform=switch',
          products: switchIds,
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
          products: accessoryIds,
        },
      ],
    } as any,
    overrideAccess: true,
  })

  // ---------------------------------------------------------------------
  // Globals — Header / Footer / SiteSettings
  // ---------------------------------------------------------------------
  payload.logger.info('🌐  Seeding site globals (header, footer, settings)…')

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          label: 'PlayStation',
          href: '/shop?platform=playstation',
          columns: [
            {
              heading: 'Shop PlayStation',
              links: [
                { label: 'PS5 Consoles', href: '/shop?platform=playstation&category=consoles' },
                { label: 'Controllers', href: '/shop?platform=playstation&category=controllers' },
                { label: 'Headsets', href: '/shop?platform=playstation&category=headsets' },
                { label: 'PS5 Games', href: '/shop?platform=playstation&category=games' },
              ],
            },
            {
              heading: 'Featured',
              links: [
                { label: 'PS5 Pro Console', href: '/products/playstation-5-pro-console' },
                { label: "Marvel's Spider-Man 2", href: '/products/marvels-spider-man-2-ps5' },
                { label: 'DualSense Edge Controller', href: '/products/dualsense-edge-wireless-controller' },
              ],
            },
          ],
        },
        {
          label: 'Xbox',
          href: '/shop?platform=xbox',
          columns: [
            {
              heading: 'Shop Xbox',
              links: [
                { label: 'Xbox Consoles', href: '/shop?platform=xbox&category=consoles' },
                { label: 'Controllers', href: '/shop?platform=xbox&category=controllers' },
                { label: 'Xbox Games', href: '/shop?platform=xbox&category=games' },
              ],
            },
            {
              heading: 'Featured',
              links: [
                { label: 'Xbox Series X', href: '/products/xbox-series-x-console' },
                { label: 'Elite Controller Series 2', href: '/products/xbox-elite-wireless-controller-series-2' },
                { label: 'Starfield: Constellation Edition', href: '/products/starfield-constellation-edition' },
              ],
            },
          ],
        },
        {
          label: 'Nintendo Switch',
          href: '/shop?platform=switch',
          columns: [
            {
              heading: 'Shop Switch',
              links: [
                { label: 'Switch Consoles', href: '/shop?platform=switch&category=consoles' },
                { label: 'Joy-Con & Controllers', href: '/shop?platform=switch&category=controllers' },
                { label: 'Switch Games', href: '/shop?platform=switch&category=games' },
              ],
            },
            {
              heading: 'Featured',
              links: [
                { label: 'Switch OLED Model', href: '/products/nintendo-switch-oled-model' },
                { label: 'Zelda: Tears of the Kingdom', href: '/products/zelda-tears-of-the-kingdom' },
                { label: 'Mario Kart 8 Deluxe', href: '/products/mario-kart-8-deluxe' },
              ],
            },
          ],
        },
        {
          label: 'PC Gaming',
          href: '/shop?platform=pc',
          columns: [
            {
              heading: 'Shop PC gear',
              links: [
                { label: 'Keyboards & Mice', href: '/shop?category=keyboards-mice' },
                { label: 'Headsets', href: '/shop?category=headsets' },
                { label: 'Racing Wheels', href: '/shop?category=racing-wheels' },
              ],
            },
            {
              heading: 'Featured',
              links: [
                { label: 'Logitech G Pro X Superlight 2', href: '/products/logitech-g-pro-x-superlight-2' },
                { label: 'SteelSeries Apex Pro TKL', href: '/products/steelseries-apex-pro-tkl' },
                { label: 'ASUS ROG Azoth', href: '/products/asus-rog-azoth-keyboard' },
              ],
            },
          ],
        },
        {
          label: 'Accessories',
          href: '/shop?category=accessories',
          columns: [
            {
              heading: 'Categories',
              links: [
                { label: 'Controllers', href: '/shop?category=controllers' },
                { label: 'Headsets', href: '/shop?category=headsets' },
                { label: 'Racing Wheels', href: '/shop?category=racing-wheels' },
                { label: 'Charging Stations', href: '/shop?category=charging-stations' },
              ],
            },
            {
              heading: 'Top picks',
              links: [
                { label: 'Razer BlackShark V2 Pro', href: '/products/razer-blackshark-v2-pro' },
                { label: 'SteelSeries Arctis Nova Pro', href: '/products/steelseries-arctis-nova-pro-wireless' },
                { label: 'Logitech G29 Racing Wheel', href: '/products/logitech-g29-racing-wheel' },
              ],
            },
          ],
        },
        {
          label: 'Deals',
          href: '/shop?sort=deals',
          columns: [],
        },
      ],
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          heading: 'Shop',
          links: [
            { label: 'PlayStation', href: '/shop?platform=playstation' },
            { label: 'Xbox', href: '/shop?platform=xbox' },
            { label: 'Nintendo Switch', href: '/shop?platform=switch' },
            { label: 'Accessories', href: '/shop?category=accessories' },
            { label: 'Deals', href: '/shop?sort=deals' },
          ],
        },
        {
          heading: 'Support',
          links: [
            { label: 'Contact Us', href: '/contact' },
            { label: 'Shipping & Returns', href: '/shipping-returns' },
            { label: 'Track Your Order', href: '/account/orders' },
            { label: 'FAQs', href: '/contact' },
          ],
        },
        {
          heading: 'Company',
          links: [
            { label: 'About The Games Ocean', href: '/about' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms of Service', href: '/terms-of-service' },
          ],
        },
      ],
      bottomText: `© ${new Date().getFullYear()} The Games Ocean. All rights reserved. Designed for players, built for Pakistan.`,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      storeName: 'THE GAMES OCEAN',
      tagline: 'Next-Level Gear',
      currency: 'PKR',
      announcementText: 'Free express delivery across Pakistan on orders over Rs. 15,000 — pay cash on delivery',
      contactEmail: 'support@thegamesocean.com',
      contactPhone: '+92 300 1234567',
      address: 'Gulberg III, Lahore, Pakistan',
      socialLinks: [
        { platform: 'instagram', href: 'https://instagram.com/thegamesocean' },
        { platform: 'facebook', href: 'https://facebook.com/thegamesocean' },
        { platform: 'youtube', href: 'https://youtube.com/@thegamesocean' },
        { platform: 'discord', href: 'https://discord.gg/thegamesocean' },
      ],
    },
    overrideAccess: true,
  })

  payload.logger.info('✅  The Games Ocean seed complete!')
  payload.logger.info('   Admin login → admin@thegamesocean.com / GamesOceanAdmin#2026')
  payload.logger.info('   Customer login → ayesha.khan@example.com / Customer#123')
}

// `payload run` does `await import(scriptPath)` then immediately calls `process.exit(0)` —
// top-level await ensures the module doesn't resolve until the seed actually finishes.
await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
