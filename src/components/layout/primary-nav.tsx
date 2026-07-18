'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { Header as HeaderGlobal } from '@/payload-types'

export type NavItem = NonNullable<HeaderGlobal['navItems']>[number]

const ITEM_CLASS =
  'shrink-0 whitespace-nowrap rounded-xl px-2.5 py-2 font-display text-sm font-semibold text-ink-700 transition-all hover:bg-surface-100 hover:text-ink-900 xl:px-3'

/**
 * Desktop nav row that measures its own available width and collapses
 * whichever trailing items don't fit into a "More" dropdown, so item count
 * (which comes from the CMS and can grow) never wraps or overflows the header.
 */
export function PrimaryNav({ items }: { items: NavItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(items.length)

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const recalc = () => {
      const containerWidth = container.offsetWidth
      const itemEls = Array.from(measure.children) as HTMLElement[]
      const widths = itemEls.map((el) => el.offsetWidth)
      const totalWidth = widths.reduce((a, b) => a + b, 0)

      if (totalWidth <= containerWidth) {
        setVisibleCount(items.length)
        return
      }

      const moreWidth = moreRef.current?.offsetWidth ?? 0
      let sum = moreWidth
      let count = 0
      for (const w of widths) {
        if (sum + w > containerWidth) break
        sum += w
        count++
      }
      setVisibleCount(count)
    }

    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(container)
    return () => ro.disconnect()
  }, [items])

  const visibleItems = items.slice(0, visibleCount)
  const overflowItems = items.slice(visibleCount)

  return (
    <div ref={containerRef} className="flex min-w-0 flex-1 items-center overflow-hidden">
      <nav className="flex flex-nowrap items-center gap-0.5">
        {visibleItems.map((item) => (
          <NavMenuItem key={item.id ?? item.label} item={item} />
        ))}
        {overflowItems.length > 0 && <MoreMenu items={overflowItems} />}
      </nav>

      {/* Off-screen measurer: mirrors every item so we can read natural widths before deciding what fits */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex flex-nowrap items-center gap-0.5"
        style={{ left: -99999, top: -99999 }}
      >
        {items.map((item) => (
          <NavMenuItem key={item.id ?? item.label} item={item} />
        ))}
      </div>
      <div ref={moreRef} aria-hidden className="pointer-events-none invisible absolute" style={{ left: -99999, top: -99999 }}>
        <MoreButton />
      </div>
    </div>
  )
}

function MoreButton() {
  return (
    <button type="button" className={cn(ITEM_CLASS, 'flex items-center gap-1')}>
      More
      <ChevronDown size={13} />
    </button>
  )
}

function MoreMenu({ items }: { items: NavItem[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label="More categories" className={cn(ITEM_CLASS, 'flex items-center gap-1')}>
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={12}
          className="z-50 max-h-[70vh] w-64 overflow-y-auto rounded-2xl bg-white p-1.5 text-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-surface-300 animate-pop-in"
        >
          {items.map((item, i) => (
            <div key={item.id ?? item.label}>
              {i > 0 && <div className="my-1 h-px bg-surface-200" />}
              <DropdownMenu.Item asChild>
                <Link
                  href={item.href}
                  className="flex items-center rounded-xl px-3 py-2.5 font-display text-sm font-semibold text-ink-900 outline-none transition-colors hover:bg-surface-100"
                >
                  {item.label}
                </Link>
              </DropdownMenu.Item>
              {(item.columns ?? []).map((col) => (
                <div key={col.id ?? col.heading} className="px-1">
                  <p className="px-3 pt-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-ink-400">
                    {col.heading}
                  </p>
                  {(col.links ?? []).map((link) => (
                    <DropdownMenu.Item key={link.id ?? link.label} asChild>
                      <Link
                        href={link.href}
                        className="flex items-center rounded-xl px-3 py-2 text-sm text-ink-500 outline-none transition-colors hover:bg-surface-100 hover:text-ink-900"
                      >
                        {link.label}
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export function NavMenuItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const hasMega = item.columns && item.columns.length > 0

  if (!hasMega) {
    return (
      <Link href={item.href} className={ITEM_CLASS}>
        {item.label}
      </Link>
    )
  }

  return (
    <div className="relative shrink-0" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link href={item.href} className={cn(ITEM_CLASS, 'flex items-center gap-1')}>
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
