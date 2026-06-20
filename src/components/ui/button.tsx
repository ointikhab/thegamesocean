import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-display font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-glow/40 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-violet-glow to-cyan-glow text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_32px_rgba(124,58,237,0.45)] hover:brightness-105 active:brightness-95',
        secondary:
          'bg-white border border-surface-300 text-ink-700 shadow-sm hover:border-surface-400 hover:shadow-md hover:text-ink-900',
        outline:
          'border border-surface-300 bg-white text-ink-700 hover:border-violet-glow/40 hover:text-violet-glow hover:bg-violet-glow/5',
        ghost:
          'text-ink-500 hover:bg-surface-100 hover:text-ink-900',
        danger:
          'bg-magenta-glow/10 text-magenta-glow border border-magenta-glow/25 hover:bg-magenta-glow hover:text-white',
      },
      size: {
        sm:   'h-9 px-4 text-xs',
        md:   'h-11 px-6 text-sm',
        lg:   'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className)
    if (href) return <Link href={href} className={classes}>{children}</Link>
    return <button ref={ref} className={classes} {...props}>{children}</button>
  },
)
Button.displayName = 'Button'

export { buttonVariants }
