'use client'

import { AuthProvider } from './auth-provider'
import { CartProvider } from './cart-provider'
import { ToastProvider } from './toast-provider'
import { WishlistProvider } from './wishlist-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
