'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Product } from './types'

export interface CartItem {
  product: Product
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  add: (product: Product) => void
  addWithQty: (product: Product, qty: number) => void
  remove: (title: string) => void
  updateQty: (title: string, qty: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.title === product.title)
      if (existing) {
        return prev.map((i) =>
          i.product.title === product.title ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }, [])

  const addWithQty = useCallback((product: Product, qty: number) => {
    if (qty <= 0) return
    setItems((prev) => {
      const existing = prev.find((i) => i.product.title === product.title)
      if (existing) {
        return prev.map((i) =>
          i.product.title === product.title ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { product, qty }]
    })
  }, [])

  const remove = useCallback((title: string) => {
    setItems((prev) => prev.filter((i) => i.product.title !== title))
  }, [])

  const updateQty = useCallback((title: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.title !== title))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.product.title === title ? { ...i, qty } : i))
      )
    }
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => {
    const price = i.product.comp_price ?? i.product.price ?? 0
    return s + price * i.qty
  }, 0)

  return (
    <CartContext.Provider value={{ items, add, addWithQty, remove, updateQty, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
