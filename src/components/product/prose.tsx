import { RichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'
import type { Product } from '@/payload-types'

const PROSE_CLASSES = cn(
  '[&_p]:mb-4 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-ink-500 [&_p:last-child]:mb-0',
  '[&_h1]:font-display [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-ink-900 [&_h1]:mb-3 [&_h1]:mt-6',
  '[&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink-900 [&_h2]:mb-3 [&_h2]:mt-6',
  '[&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-ink-900 [&_h3]:mb-2 [&_h3]:mt-5',
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-ink-500',
  '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:text-ink-500',
  '[&_li]:leading-relaxed',
  '[&_a]:text-violet-glow [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-cyan-glow',
  '[&_strong]:text-ink-900 [&_strong]:font-semibold',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-violet-glow/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink-400',
)

export function ProductDescription({ description }: { description: Product['description'] }) {
  if (!description) return <p className="text-sm text-ink-400">No description available for this product yet.</p>
  return <RichText data={description} className={PROSE_CLASSES} />
}
