import { notFound, redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { getProductHref } from '@/lib/utils'

export default async function OldProductRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const product = res.docs[0]
  if (!product) notFound()

  redirect(getProductHref(product))
}
