'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useState } from 'react'

type Toast = {
  id: number
  title: string
  description?: string
  variant?: 'success' | 'info'
}

type ToastContextValue = {
  show: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let counter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++counter
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="glass-panel pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-2xl"
            >
              <div className="mt-0.5 shrink-0 text-cyan-glow">
                {toast.variant === 'info' ? <Info size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-ink-100">{toast.title}</p>
                {toast.description ? <p className="mt-0.5 text-xs text-ink-500">{toast.description}</p> : null}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-ink-700 transition-colors hover:text-ink-100"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
