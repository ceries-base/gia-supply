'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Product } from './types'

export interface CartItem {
  product: Product
  qty: number
  color: string | null
  length: string | null
}

interface CartContextValue {
  items: CartItem[]
  add: (product: Product) => void
  addWithQty: (product: Product, qty: number, color?: string | null, length?: string | null) => void
  remove: (key: string) => void
  updateQty: (key: string, qty: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

function itemKey(title: string, color: string | null, length: string | null) {
  return `${title}||${color ?? ''}||${length ?? ''}`
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = useCallback((product: Product) => {
    const key = itemKey(product.title, null, null)
    setItems((prev) => {
      const existing = prev.find((i) => itemKey(i.product.title, i.color, i.length) === key)
      if (existing) {
        return prev.map((i) => itemKey(i.product.title, i.color, i.length) === key ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { product, qty: 1, color: null, length: null }]
    })
  }, [])

  const addWithQty = useCallback((product: Product, qty: number, color: string | null = null, length: string | null = null) => {
    if (qty <= 0) return
    const key = itemKey(product.title, color, length)
    setItems((prev) => {
      const existing = prev.find((i) => itemKey(i.product.title, i.color, i.length) === key)
      if (existing) {
        return prev.map((i) => itemKey(i.product.title, i.color, i.length) === key ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, { product, qty, color, length }]
    })
  }, [])

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i.product.title, i.color, i.length) !== key))
  }, [])

  const updateQty = useCallback((key: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => itemKey(i.product.title, i.color, i.length) !== key))
    } else {
      setItems((prev) =>
        prev.map((i) => itemKey(i.product.title, i.color, i.length) === key ? { ...i, qty } : i)
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
