import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-gradient-to-r from-base-800 via-base-700 to-base-800 bg-[length:200%_100%]',
        className,
      )}
    />
  )
}
