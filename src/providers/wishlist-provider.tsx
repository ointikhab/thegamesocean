'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type WishlistContextValue = {
  ids: number[]
  has: (productId: number) => boolean
  toggle: (productId: number) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

const STORAGE_KEY = 'thegamesocean.wishlist.v1'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setIds(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids, hydrated])

  const has = useCallback((productId: number) => ids.includes(productId), [ids])

  const toggle = useCallback((productId: number) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }, [])

  const value = useMemo(() => ({ ids, has, toggle }), [ids, has, toggle])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
