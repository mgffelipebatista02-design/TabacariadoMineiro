'use client'

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem } from '@/types'
import { B2B_MIN_ORDER, DISCOUNT_TIERS } from '@/lib/constants'
import { useMode } from '@/hooks/use-mode'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variationId?: string) => void
  updateQuantity: (productId: string, quantity: number, variationId?: string) => void
  clearCart: () => void
  subtotal: number
  discount: number
  discountTier: number | null
  shipping: number
  setShipping: (value: number) => void
  total: number
  b2bMinOrderMet: boolean
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'tabacaria-cart'

function getItemKey(item: { productId: string; variationId?: string }) {
  return item.variationId ? `${item.productId}:${item.variationId}` : item.productId
}

function calculateDiscount(subtotal: number): { rate: number; tier: number | null } {
  let rate = 0
  let tier: number | null = null

  for (const t of DISCOUNT_TIERS) {
    if (subtotal >= t.min) {
      rate = t.discount
      tier = t.min
    }
  }

  return { rate, tier }
}

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const { mode } = useMode()
  const [items, setItems] = useState<CartItem[]>([])
  const [shipping, setShipping] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed.items)) {
          setItems(parsed.items)
        }
        if (typeof parsed.shipping === 'number') {
          setShipping(parsed.shipping)
        }
      }
    } catch {
      // ignore corrupt data
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, shipping }))
    }
  }, [items, shipping, hydrated])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = getItemKey(item)
      const existing = prev.find((i) => getItemKey(i) === key)
      if (existing) {
        return prev.map((i) =>
          getItemKey(i) === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((productId: string, variationId?: string) => {
    const key = variationId ? `${productId}:${variationId}` : productId
    setItems((prev) => prev.filter((i) => getItemKey(i) !== key))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variationId?: string) => {
      if (quantity <= 0) {
        removeItem(productId, variationId)
        return
      }
      const key = variationId ? `${productId}:${variationId}` : productId
      setItems((prev) =>
        prev.map((i) => (getItemKey(i) === key ? { ...i, quantity } : i))
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setItems([])
    setShipping(0)
  }, [])

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const { rate: discountRate, tier: discountTier } = useMemo(
    () => calculateDiscount(subtotal),
    [subtotal]
  )

  const discount = useMemo(() => subtotal * discountRate, [subtotal, discountRate])

  const total = useMemo(
    () => Math.max(0, subtotal - discount + shipping),
    [subtotal, discount, shipping]
  )

  const b2bMinOrderMet = useMemo(
    () => (mode === 'b2b' ? subtotal >= B2B_MIN_ORDER : true),
    [mode, subtotal]
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        discountTier,
        shipping,
        setShipping,
        total,
        b2bMinOrderMet,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
