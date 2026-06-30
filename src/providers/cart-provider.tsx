'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  productId: number
  slug: string
  title: string
  image: string
  price: number
  compareAtPrice?: number | null
  variantLabel?: string
  quantity: number
  maxQuantity: number
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'thegamesocean.cart.v1'

function makeId(productId: number, variantLabel?: string) {
  return `${productId}::${variantLabel ?? 'default'}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem: CartContextValue['addItem'] = useCallback((incoming) => {
    const id = makeId(incoming.productId, incoming.variantLabel)
    const qtyToAdd = incoming.quantity ?? 1

    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(i.quantity + qtyToAdd, i.maxQuantity || 99) }
            : i,
        )
      }
      return [...prev, { ...incoming, id, quantity: Math.min(qtyToAdd, incoming.maxQuantity || 99) }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity || 99)) } : i))
        .filter((i) => i.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, isOpen, itemCount, subtotal, openCart, closeCart, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
