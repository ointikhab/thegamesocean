import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, label = 'NEXORA' }: { className?: string; label?: string }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-glow to-cyan-glow shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_24px_rgba(124,58,237,0.5)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M4 16.5V7.5L12 3l8 4.5v9L12 21l-8-4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
          <path d="M4 7.5 12 12m0 0 8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
      </span>
      <span className="font-display text-xl font-bold tracking-[0.12em] text-ink-900">
        {label}
      </span>
    </Link>
  )
}
