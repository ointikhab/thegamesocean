'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Headphones, MessageCircle, Send, X, Zap } from 'lucide-react'
import { useState } from 'react'

type Field = 'name' | 'email' | 'subject' | 'message'
type FormState = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const INITIAL: FormState = { name: '', email: '', subject: '', message: '' }

export function ChatWidget() {
  const [open, setOpen] = useState(false)
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

  const submit = async () => {
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

  const close = () => {
    setOpen(false)
    if (sent) setTimeout(() => setSent(false), 400)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="w-[360px] overflow-hidden rounded-3xl"
            style={{
              background: 'linear-gradient(160deg, #13131e 0%, #0a0a12 100%)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(124,58,237,0.12)',
            }}
          >
            {/* Animated gradient border top */}
            <div
              className="h-[2px] w-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #00e5ff, #ff0080, #7c3aed)', backgroundSize: '200%' }}
            />

            {/* ── Header ── */}
            <div className="relative overflow-hidden px-5 py-4">
              {/* Background orbs */}
              <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-violet-glow opacity-20 blur-2xl" />
              <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-cyan-glow opacity-15 blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar cluster */}
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-glow to-cyan-glow/70 shadow-[0_4px_16px_rgba(124,58,237,0.5)]">
                    <Headphones size={20} className="text-white" />
                    {/* Online dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#13131e] bg-emerald-400">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    </span>
                  </div>

                  <div>
                    <p className="font-display text-[13px] font-bold text-white">NEXORA Support</p>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] text-white/50">Online · Replies within 24h</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={close}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-white/8 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-white/6" />

            {/* ── Body ── */}
            <div className="px-5 py-4">
              <AnimatePresence mode="wait">
                {sent ? (
                  /* Success state */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 py-8 text-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl scale-150" />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                        <CheckCircle size={30} className="text-emerald-400" strokeWidth={1.5} />
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-white">Message sent!</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">
                        We'll reply to your email within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-1 rounded-xl border border-white/10 px-5 py-2 text-xs font-bold text-white/40 transition-all hover:border-violet-glow/50 hover:bg-violet-glow/8 hover:text-white"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  /* Form */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                    {/* Intro chip */}
                    <div className="mb-1 flex items-center gap-2 rounded-xl bg-violet-glow/8 px-3.5 py-2.5 ring-1 ring-violet-glow/15">
                      <Zap size={12} className="shrink-0 text-violet-glow" />
                      <p className="text-[12px] leading-snug text-white/60">
                        Ask about orders, stock, or anything — we'll reply to your email.
                      </p>
                    </div>

                    {/* Name + Email row */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <Field label="Name" error={errors.name}>
                        <input
                          value={form.name}
                          onChange={set('name')}
                          placeholder="Your name"
                          className={inputCls(!!errors.name)}
                        />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input
                          value={form.email}
                          onChange={set('email')}
                          type="email"
                          placeholder="you@email.com"
                          className={inputCls(!!errors.email)}
                        />
                      </Field>
                    </div>

                    <Field label="Subject" error={errors.subject}>
                      <input
                        value={form.subject}
                        onChange={set('subject')}
                        placeholder="e.g. Order update, stock question…"
                        className={inputCls(!!errors.subject)}
                      />
                    </Field>

                    <Field label="Message" error={errors.message}>
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        rows={3}
                        placeholder="Tell us how we can help…"
                        className={`${inputCls(!!errors.message)} resize-none`}
                      />
                    </Field>

                    {/* Send button */}
                    <button
                      onClick={submit}
                      disabled={sending}
                      className="relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3 font-display text-[12px] font-bold uppercase tracking-widest text-white transition-all disabled:cursor-wait disabled:opacity-60"
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #06b6d4 100%)',
                        boxShadow: '0 4px 24px rgba(124,58,237,0.45)',
                      }}
                    >
                      {/* Shine sweep */}
                      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
                      {sending ? (
                        <>
                          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          Send message
                        </>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-white/20">
                      We'll reply directly to your email · No spam ever
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trigger button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Open support chat"
        className="relative flex h-[58px] w-[58px] items-center justify-center rounded-2xl text-white"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
          boxShadow: open
            ? '0 0 0 4px rgba(124,58,237,0.25), 0 8px 32px rgba(124,58,237,0.6)'
            : '0 4px 24px rgba(124,58,237,0.55)',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulsing availability dot */}
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-55" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0a12]" />
          </span>
        )}
      </motion.button>
    </div>
  )
}

/* Helpers */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-white/35">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none transition-all',
    'bg-white/5 border border-white/8',
    'focus:border-violet-glow/50 focus:bg-white/7 focus:ring-2 focus:ring-violet-glow/15',
    hasError && 'border-red-500/60 ring-2 ring-red-500/15',
  ]
    .filter(Boolean)
    .join(' ')
}
