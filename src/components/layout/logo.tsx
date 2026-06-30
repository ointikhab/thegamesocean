import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const FALLBACK_LOGO = '/media/logo-icon.png'

export function Logo({
  className,
  label = 'THE GAMES OCEAN',
  src,
}: {
  className?: string
  label?: string
  src?: string | null
}) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="relative flex h-13 w-13 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <Image
          src={src || FALLBACK_LOGO}
          alt=""
          width={52}
          height={52}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      <span className="font-display text-2xl font-bold tracking-[0.12em] text-ink-900">
        {label}
      </span>
    </Link>
  )
}
