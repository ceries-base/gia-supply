'use client'

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/lib/cart'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, remove, updateQty, totalItems, totalPrice, clear } = useCart()

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h2 className="text-base font-bold text-gray-900">
              Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
              )}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-20">
              <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add products to get started</p>
            </div>
          ) : (
            items.map(({ product, qty }) => {
              const displayPrice = product.comp_price ?? product.price
              return (
                <div key={product.title} className="flex gap-3">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 line-clamp-2 leading-snug">{product.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{product.company}</p>
                    {displayPrice != null && (
                      <p className="text-[13px] font-bold text-[#e94560] mt-0.5">${displayPrice.toFixed(2)}</p>
                    )}
                  </div>

                  {/* Qty + remove */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => remove(product.title)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-1.5 py-0.5">
                      <button
                        onClick={() => updateQty(product.title, qty - 1)}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[13px] font-medium text-gray-900 w-5 text-center">{qty}</span>
                      <button
                        onClick={() => updateQty(product.title, qty + 1)}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-base font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-gray-900 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
              Request Quote
            </button>
            <button
              onClick={clear}
              className="w-full text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
