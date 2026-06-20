import { ProductCard } from '@/components/shop/product-card'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import type { Product } from '@/payload-types'

export function ProductRail({
  eyebrow,
  title,
  description,
  href,
  products,
}: {
  eyebrow?: string
  title: string
  description?: string
  href?: string
  products: Product[]
}) {
  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} href={href} />
      </Reveal>

      {/* Subtle divider */}
      <div className="divider-gradient mt-6 mb-8" />

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  )
}
