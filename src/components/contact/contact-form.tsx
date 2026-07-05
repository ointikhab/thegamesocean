'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Send } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

type Field = 'name' | 'email' | 'subject' | 'message'
type FormState = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const INITIAL: FormState = { name: '', email: '', subject: '', message: '' }

const INPUT = cn(
  'w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none',
  'placeholder:text-ink-300 transition-all focus:border-violet-glow/50 focus:ring-2 focus:ring-violet-glow/15',
)
const LABEL = 'mb-1.5 block font-display text-xs font-bold uppercase tracking-wider text-ink-500'

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [f]: e.target.value }))
    setErrors((prev) => ({ ...prev, [f]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    try {
      const res = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          subject: form.subject,
          message: form.message,
          status: 'open',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSent(true)
      setForm(INITIAL)
    } catch {
      setErrors({ message: 'Failed to send. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-glow/10 text-emerald-glow">
          <CheckCircle size={26} />
        </span>
        <p className="font-display text-lg font-semibold text-ink-900">Message sent!</p>
        <p className="max-w-xs text-sm text-ink-500">
          Thanks for reaching out — our team will get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 text-xs font-semibold text-violet-glow hover:text-violet-glow/80"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Name</label>
          <input value={form.name} onChange={set('name')} placeholder="Your name" className={INPUT} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className={LABEL}>Email</label>
          <input value={form.email} onChange={set('email')} type="email" placeholder="you@example.com" className={INPUT} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className={LABEL}>Subject</label>
        <input value={form.subject} onChange={set('subject')} placeholder="How can we help?" className={INPUT} />
        {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
      </div>

      <div>
        <label className={LABEL}>Message</label>
        <textarea
          value={form.message}
          onChange={set('message')}
          rows={5}
          placeholder="Tell us a bit more…"
          className={cn(INPUT, 'resize-none')}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>

      <motion.button
        type="submit"
        disabled={sending}
        whileTap={{ scale: 0.97 }}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-glow font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <>
            <Send size={15} /> Send message
          </>
        )}
      </motion.button>
    </form>
  )
}
