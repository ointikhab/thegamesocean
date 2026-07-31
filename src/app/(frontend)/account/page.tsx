'use client'

import { ArrowRight, Heart, LogIn, LogOut, Package, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Reveal } from '@/components/ui/reveal'
import { useAuth } from '@/providers/auth-provider'
import { useToast } from '@/providers/toast-provider'

export default function AccountPage() {
  const { customer, loading, logout } = useAuth()
  const { show } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    show({ title: 'Signed out', description: 'See you next time!', variant: 'info' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto h-40 max-w-lg animate-pulse rounded-2xl bg-surface-200" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center px-4 py-28 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 text-ink-400">
            <User size={28} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-ink-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-ink-500">Track orders, manage your wishlist, and check out faster.</p>
          <Link
            href="/login?redirect=/account"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-violet-glow px-6 py-3 font-display text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all hover:brightness-105"
          >
            <LogIn size={15} /> Sign in
          </Link>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-glow/10 font-display text-lg font-bold text-violet-glow">
            {customer.firstName.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-sm text-ink-500">{customer.email}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow">
              <Package size={18} />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-ink-900">Your orders</p>
              <p className="text-xs text-ink-500">Track delivery status &amp; history</p>
            </div>
          </div>
          <ArrowRight size={16} className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-ink-600" />
        </Link>

        <Link
          href="/wishlist"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-magenta-glow/10 text-magenta-glow">
              <Heart size={18} />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-ink-900">Your wishlist</p>
              <p className="text-xs text-ink-500">Items you&apos;ve saved for later</p>
            </div>
          </div>
          <ArrowRight size={16} className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-ink-600" />
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-magenta-glow transition-colors hover:text-magenta-glow/80"
      >
        <LogOut size={13} /> Sign out
      </button>
    </div>
  )
}
