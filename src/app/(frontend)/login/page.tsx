'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useToast } from '@/providers/toast-provider'

const INPUT = cn(
  'w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none',
  'placeholder:text-ink-300 transition-all focus:border-violet-glow/50 focus:ring-2 focus:ring-violet-glow/15',
)
const LABEL = 'mb-1.5 block font-display text-xs font-bold uppercase tracking-wider text-ink-500'

function LoginForm() {
  const { login } = useAuth()
  const { show } = useToast()
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setError('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    show({ title: 'Welcome back!', description: 'You are now logged in.', variant: 'success' })
    router.push(redirect)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className={LABEL}>Email address</label>
        <input value={form.email} onChange={set('email')} type="email" placeholder="you@example.com" autoComplete="email" className={INPUT} />
      </div>

      <div>
        <label className={LABEL}>Password</label>
        <div className="relative">
          <input
            value={form.password}
            onChange={set('password')}
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn(INPUT, 'pr-11')}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-glow font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        ) : (
          <><LogIn size={15} /> Sign in</>
        )}
      </motion.button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-500">Sign in to your The Games Ocean account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-surface-200 bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center">
            <p className="text-sm text-ink-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-violet-glow hover:text-violet-glow/80">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Perks */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-ink-400">
          {['Order tracking', 'Saved wishlist', 'Faster checkout'].map((p) => (
            <span key={p} className="flex items-center gap-1.5">
              <Zap size={10} className="text-violet-glow" />{p}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
