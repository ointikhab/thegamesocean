'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/providers/toast-provider'

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const { show } = useToast()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    show({ title: "You're on the list!", description: 'Watch your inbox for drops & deals.', variant: 'success' })
    setEmail('')
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="h-12"
      />
      <Button type="submit" size="md" className="shrink-0">
        Subscribe
      </Button>
    </form>
  )
}
