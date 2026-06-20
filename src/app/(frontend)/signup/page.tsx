'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useToast } from '@/providers/toast-provider'

const INPUT = cn(
  'w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none',
  'placeholder:text-ink-300 transition-all focus:border-violet-glow/50 focus:ring-2 focus:ring-violet-glow/15',
)
const LABEL = 'mb-1.5 block font-display text-xs font-bold uppercase tracking-wider text-ink-500'

export default function SignupPage() {
  const { signup } = useAuth()
  const { show } = useToast()
  const router = useRouter()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({})

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined, general: undefined }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!form.password) e.password = 'Required'
    else if (form.password.length < 8) e.password = 'At least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = await signup({
      firstName: form.firstName,
      lastName: form.lastName || undefined,
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (result.error) { setErrors({ general: result.error }); return }
    show({ title: 'Account created!', description: `Welcome to NEXORA, ${form.firstName}!`, variant: 'success' })
    router.push('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center"><Logo /></div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
          <p className="mt-2 text-sm text-ink-500">Join NEXORA and start building your setup</p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
          <form onSubmit={submit} className="flex flex-col gap-4">
            {errors.general && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>First name *</label>
                <input value={form.firstName} onChange={set('firstName')} placeholder="Ayesha" className={cn(INPUT, errors.firstName && 'border-red-400')} />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className={LABEL}>Last name</label>
                <input value={form.lastName} onChange={set('lastName')} placeholder="Khan" className={INPUT} />
              </div>
            </div>

            <div>
              <label className={LABEL}>Email address *</label>
              <input value={form.email} onChange={set('email')} type="email" placeholder="you@example.com" autoComplete="email" className={cn(INPUT, errors.email && 'border-red-400')} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className={LABEL}>Password *</label>
              <div className="relative">
                <input
                  value={form.password}
                  onChange={set('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                  className={cn(INPUT, 'pr-11', errors.password && 'border-red-400')}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className={LABEL}>Confirm password *</label>
              <input
                value={form.confirm}
                onChange={set('confirm')}
                type={showPw ? 'text' : 'password'}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className={cn(INPUT, errors.confirm && 'border-red-400')}
              />
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-glow font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <><UserPlus size={15} />Create account</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-ink-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-violet-glow hover:text-violet-glow/80">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-ink-400">
          {['Free to join', 'No spam ever', 'Cancel anytime'].map((p) => (
            <span key={p} className="flex items-center gap-1.5">
              <Zap size={10} className="text-violet-glow" />{p}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
