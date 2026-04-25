'use client'

import { useEffect, useState } from 'react'
import { Package, Trash2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  sku: string
  title: string
  variant_title: string | null
  quantity: number
  unit_price: number
}

interface Order {
  id: string
  order_number: string
  status: string
  created_at: string
  submitted_by: string
  note: string | null
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [voiding, setVoiding] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch('/api/orders')
      if (!r.ok) throw new Error(`Failed to load orders`)
      const data = await r.json()
      setOrders(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function voidOrder(order: Order) {
    if (!confirm(`Void order ${order.order_number}? This cannot be undone.`)) return
    setVoiding(order.id)
    try {
      const r = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' })
      if (!r.ok) {
        const d = await r.json()
        throw new Error(d.error || 'Failed to void order')
      }
      setOrders(prev => prev.filter(o => o.id !== order.id))
    } catch (e: any) {
      alert(e.message)
    } finally {
      setVoiding(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
            ← Catalog
          </Link>
          <h1 className="text-base font-bold text-gray-900">My Orders</h1>
        </div>
        <button
          onClick={fetchOrders}
          className="text-gray-400 hover:text-gray-700 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-300">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400 text-sm">{error}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <Package className="w-10 h-10 text-gray-200" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <Link href="/" className="text-sm text-[#e94560] hover:underline">Browse catalog</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const isOpen = expanded.has(order.id)
              const totalQty = order.items.reduce((s, i) => s + i.quantity, 0)
              return (
                <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {/* Row */}
                  <div className="flex items-center gap-3 px-5 py-4">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{order.order_number}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {totalQty} item{totalQty !== 1 ? 's' : ''} · {new Date(order.created_at).toLocaleDateString()}
                          {order.note && ` · ${order.note}`}
                        </p>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-300 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                    </button>

                    <button
                      onClick={() => voidOrder(order)}
                      disabled={voiding === order.id}
                      className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50 ml-2"
                      title="Void order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Items */}
                  {isOpen && (
                    <div className="border-t border-gray-50 divide-y divide-gray-50">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-2.5 text-[12px]">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">{item.title}</p>
                            {item.variant_title && (
                              <p className="text-gray-400 text-[10px]">{item.variant_title}</p>
                            )}
                            {item.sku && <p className="text-gray-300 text-[10px] font-mono">{item.sku}</p>}
                          </div>
                          <span className="font-semibold text-gray-700 ml-4 flex-shrink-0">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
