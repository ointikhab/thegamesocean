import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.15em]',
  {
    variants: {
      variant: {
        sale:     'bg-magenta-glow text-white shadow-[0_2px_8px_rgba(219,39,119,0.35)]',
        new:      'bg-cyan-glow text-white shadow-[0_2px_8px_rgba(8,145,178,0.35)]',
        soldout:  'bg-surface-300 text-ink-400',
        featured: 'bg-violet-glow text-white shadow-[0_2px_8px_rgba(124,58,237,0.35)]',
        outline:  'border border-surface-300 text-ink-500 bg-white',
        success:  'bg-emerald-glow text-white shadow-[0_2px_8px_rgba(5,150,105,0.35)]',
        warning:  'bg-gold-glow text-white',
        hot:      'bg-orange-glow text-white shadow-[0_2px_8px_rgba(234,88,12,0.35)]',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
