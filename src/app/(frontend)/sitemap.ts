import type { MetadataRoute } from 'next'

import { getProductHref } from '@/lib/utils'
import { getPayloadClient } from '@/lib/payload'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Must render at request time, not build time — Payload/Postgres isn't reachable
// during the Railway image build step, so static generation here fails the build.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const productsRes = await payload.find({
    collection: 'products',
    where: { status: { not_equals: 'draft' } },
    limit: 0,
    depth: 1,
    overrideAccess: true,
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms-of-service`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/refund-exchange-policy`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const productRoutes: MetadataRoute.Sitemap = productsRes.docs.map((product) => ({
    url: `${BASE_URL}${getProductHref(product)}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
