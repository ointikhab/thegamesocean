import React from 'react'

import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink-100 placeholder:text-ink-700 outline-none transition-colors focus:border-violet-glow/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-glow/20',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink-100 placeholder:text-ink-700 outline-none transition-colors focus:border-violet-glow/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-glow/20',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-500', className)} {...props} />
)
