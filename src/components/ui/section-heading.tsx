import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = 'View all',
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  href?: string
  hrefLabel?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:items-center sm:justify-center sm:text-center',
        className,
      )}
    >
      <div className={cn(align === 'center' && 'mx-auto max-w-2xl')}>
        {eyebrow && (
          <div className={cn('mb-3 flex items-center gap-3', align === 'center' && 'justify-center')}>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-glow/25 bg-violet-glow/8 px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-violet-glow">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-glow animate-pulse-dot" />
              {eyebrow}
            </span>
            {align !== 'center' && (
              <div className="h-px flex-1 max-w-[64px] bg-gradient-to-r from-violet-glow/30 to-transparent" />
            )}
          </div>
        )}
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-500">{description}</p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-2xl border border-surface-300 bg-white px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-ink-500 shadow-sm transition-all hover:border-violet-glow/40 hover:bg-violet-glow/5 hover:text-violet-glow hover:shadow-[0_4px_16px_rgba(124,58,237,0.12)] sm:self-auto"
        >
          {hrefLabel}
          <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  )
}
