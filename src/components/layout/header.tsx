'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/layout/logo'
import { SearchSuggestions } from '@/components/layout/search-suggestions'
import { cn } from '@/lib/utils'
import type { Header as HeaderGlobal, Media, SiteSetting } from '@/payload-types'
import { useAuth } from '@/providers/auth-provider'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { useWishlist } from '@/providers/wishlist-provider'

export function Header({ siteSettings, header }: { siteSettings: SiteSetting; header: HeaderGlobal }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { itemCount, openCart } = useCart()
  const { ids: wishlistIds } = useWishlist()
  const { customer, logout } = useAuth()
  const { show } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    show({ title: 'Signed out', description: 'See you next time!', variant: 'info' })
    router.push('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = header?.navItems ?? []
  const logoSrc = (() => {
    const url =
      siteSettings?.logo && typeof siteSettings.logo === 'object'
        ? (siteSettings.logo as Media).url
        : null
    if (!url) return undefined
    try { return new URL(url).pathname } catch { return url }
  })()

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearchOpen(false)
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      {siteSettings?.announcementText && (
        <div className="relative overflow-hidden bg-violet-glow py-2 px-4 text-center">
          <div className="bg-grid-full pointer-events-none absolute inset-0 opacity-20" />
          <span className="relative z-10 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            <Zap size={10} />
            {siteSettings.announcementText}
            <Zap size={10} />
          </span>
        </div>
      )}

      {/* Main nav */}
      <div
        className={cn(
          'transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-surface-300 shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
            : 'bg-white border-b border-surface-200',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Logo label={siteSettings?.storeName || 'THE GAMES OCEAN'} src={logoSrc} />
            <nav className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) => (
                <NavMenuItem key={item.id ?? item.label} item={item} />
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-all hover:bg-surface-200 hover:text-ink-900"
            >
              <Search size={18} />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-all hover:bg-surface-200 hover:text-ink-900 sm:flex"
            >
              <Heart size={18} />
              {wishlistIds.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-magenta-glow px-1 font-display text-[9px] font-bold text-white">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  aria-label="Account"
                  className={cn(
                    'hidden h-9 items-center justify-center rounded-xl text-ink-500 transition-all hover:bg-surface-200 hover:text-ink-900 sm:flex',
                    customer ? 'gap-2 px-3' : 'w-9',
                  )}
                >
                  {customer ? (
                    <>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-glow/15 font-display text-[11px] font-bold text-violet-glow">
                        {customer.firstName.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-display text-xs font-semibold text-ink-700 max-w-[80px] truncate">
                        {customer.firstName}
                      </span>
                    </>
                  ) : (
                    <User size={18} />
                  )}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={12}
                  className="z-50 w-56 rounded-2xl bg-white p-1.5 text-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-surface-300 animate-pop-in"
                >
                  {customer ? (
                    <>
                      {/* Logged-in header */}
                      <div className="mb-1 flex items-center gap-2.5 rounded-xl bg-surface-50 px-3 py-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-glow/15 font-display text-sm font-bold text-violet-glow">
                          {customer.firstName.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-display text-xs font-bold text-ink-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="truncate text-[10px] text-ink-400">{customer.email}</p>
                        </div>
                      </div>
                      {[
                        { href: '/account', label: 'My account' },
                        { href: '/account/orders', label: 'Order history' },
                        { href: '/wishlist', label: 'Wishlist' },
                      ].map((item) => (
                        <DropdownMenu.Item key={item.href} asChild>
                          <Link href={item.href} className="flex items-center rounded-xl px-3 py-2.5 text-ink-700 outline-none transition-colors hover:bg-surface-100 hover:text-ink-900">
                            {item.label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                      <div className="my-1 h-px bg-surface-200" />
                      <DropdownMenu.Item asChild>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-magenta-glow outline-none transition-colors hover:bg-magenta-glow/8"
                        >
                          Sign out
                        </button>
                      </DropdownMenu.Item>
                    </>
                  ) : (
                    <>
                      {[
                        { href: '/wishlist', label: 'Wishlist' },
                      ].map((item) => (
                        <DropdownMenu.Item key={item.href} asChild>
                          <Link href={item.href} className="flex items-center rounded-xl px-3 py-2.5 text-ink-700 outline-none transition-colors hover:bg-surface-100 hover:text-ink-900">
                            {item.label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                      <div className="my-1 h-px bg-surface-200" />
                      <DropdownMenu.Item asChild>
                        <Link href="/login" className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-violet-glow outline-none transition-colors hover:bg-violet-glow/8">
                          <Zap size={12} /> Sign in
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link href="/signup" className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-ink-500 outline-none transition-colors hover:bg-surface-100 hover:text-ink-900">
                          Create account
                        </Link>
                      </DropdownMenu.Item>
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Cart button */}
            <motion.button
              onClick={openCart}
              aria-label="Open cart"
              whileTap={{ scale: 0.95 }}
              className="relative flex h-9 items-center gap-2 rounded-xl bg-violet-glow px-4 font-display text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-violet-glow/90 hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1 font-display text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </motion.button>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 transition-all hover:bg-surface-200 hover:text-ink-900 lg:hidden"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink-900/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
          <Dialog.Content className="fixed inset-x-0 top-0 z-[71] mx-auto mt-20 w-[min(660px,94vw)] outline-none">
            <Dialog.Title className="sr-only">Search products</Dialog.Title>
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-3 rounded-2xl bg-white border border-surface-300 shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-5 py-4"
            >
              <Search size={19} className="shrink-0 text-ink-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search consoles, controllers, headsets, games…"
                className="flex-1 bg-transparent font-display text-sm text-ink-900 placeholder:text-ink-400 outline-none"
              />
              <Dialog.Close asChild>
                <button type="button" aria-label="Close search" className="shrink-0 text-ink-400 hover:text-ink-900">
                  <X size={17} />
                </button>
              </Dialog.Close>
            </form>

            <SearchSuggestions query={query} onNavigate={() => setSearchOpen(false)} />

            {query.trim().length < 2 && (
              <p className="mt-2.5 text-center font-display text-[10px] font-bold uppercase tracking-[0.3em] text-ink-400">
                Press Enter to search
              </p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Mobile menu */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink-900/25 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-[71] flex h-full w-[88vw] max-w-sm flex-col overflow-y-auto bg-white border-l border-surface-300 p-6 shadow-[0_0_60px_rgba(0,0,0,0.12)] outline-none">
            <Dialog.Title className="sr-only">Menu</Dialog.Title>

            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-glow via-cyan-glow to-magenta-glow" />

            <div className="mb-8 flex items-center justify-between">
              <Logo label={siteSettings?.storeName || 'THE GAMES OCEAN'} src={logoSrc} />
              <Dialog.Close asChild>
                <button
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-300 text-ink-500 hover:border-surface-400 hover:text-ink-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <MobileNavItem key={item.id ?? item.label} item={item} onNavigate={() => setMobileOpen(false)} />
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t border-surface-200 pt-6">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 font-display text-sm font-medium text-ink-700 transition-colors hover:bg-surface-100 hover:text-ink-900"
              >
                My account
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 font-display text-sm font-medium text-ink-700 transition-colors hover:bg-surface-100 hover:text-ink-900"
              >
                Wishlist ({wishlistIds.length})
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-xl bg-violet-glow px-4 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-violet-glow/90"
              >
                <Zap size={13} />
                Sign in
              </Link>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  )
}

type NavItem = NonNullable<HeaderGlobal['navItems']>[number]

function NavMenuItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const hasMega = item.columns && item.columns.length > 0

  if (!hasMega) {
    return (
      <Link
        href={item.href}
        className="rounded-xl px-4 py-2 font-display text-sm font-semibold text-ink-700 transition-all hover:bg-surface-100 hover:text-ink-900"
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={item.href}
        className="flex items-center gap-1 rounded-xl px-4 py-2 font-display text-sm font-semibold text-ink-700 transition-all hover:bg-surface-100 hover:text-ink-900"
      >
        {item.label}
        <ChevronDown size={13} className={cn('transition-transform duration-300', open && 'rotate-180')} />
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-40 w-[min(720px,calc(100vw-3rem))] -translate-x-1/2 pt-3"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 rounded-2xl bg-white border border-surface-300 shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-7 sm:grid-cols-3">
              {/* Top accent */}
              <div className="col-span-full -mt-7 mb-1 h-[3px] bg-gradient-to-r from-violet-glow via-cyan-glow to-transparent rounded-t-2xl" />
              {item.columns!.map((col) => (
                <div key={col.id ?? col.heading}>
                  <p className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.28em] text-violet-glow">
                    {col.heading}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {(col.links ?? []).map((link) => (
                      <li key={link.id ?? link.label}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-900"
                        >
                          <span className="h-px w-0 bg-violet-glow transition-all duration-300 group-hover:w-3" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  const hasMega = item.columns && item.columns.length > 0

  return (
    <div>
      <button
        onClick={() => (hasMega ? setOpen((o) => !o) : onNavigate())}
        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left font-display text-sm font-semibold text-ink-900 transition-colors hover:bg-surface-100"
      >
        <Link href={item.href} onClick={onNavigate}>{item.label}</Link>
        {hasMega && (
          <ChevronDown size={14} className={cn('transition-transform duration-300 text-ink-400', open && 'rotate-180')} />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && hasMega && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-3"
          >
            {item.columns!.map((col) => (
              <div key={col.id ?? col.heading} className="py-2">
                <p className="px-3 font-display text-[10px] font-bold uppercase tracking-widest text-ink-400">{col.heading}</p>
                {(col.links ?? []).map((link) => (
                  <Link
                    key={link.id ?? link.label}
                    href={link.href}
                    onClick={onNavigate}
                    className="block rounded-xl px-3 py-1.5 text-sm text-ink-500 transition-colors hover:text-ink-900 hover:bg-surface-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
