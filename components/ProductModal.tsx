'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingCart, Check, Package } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/cart'

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  const { addWithQty } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)

  const {
    title,
    company,
    description,
    product_type,
    hair_type,
    image_url,
    color_swatches,
    colors,
    price,
    comp_price,
    total_qty,
    lengths,
    variant_details,
  } = product

  // Find the matching variant for selected color/length to get its price + qty
  const selectedVariant = variant_details.find(v =>
    (!selectedColor || v.color === selectedColor) &&
    (!selectedLength || v.length === selectedLength)
  ) ?? null

  const variantPrice = selectedVariant?.price ?? null
  const variantQty = selectedVariant?.qty ?? total_qty

  // Price range across all variants
  const allPrices = variant_details.map(v => v.price).filter((p): p is number => p !== null)
  const minPrice = allPrices.length ? Math.min(...allPrices) : null
  const maxPrice = allPrices.length ? Math.max(...allPrices) : null

  const displayPrice = variantPrice ?? comp_price ?? price

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleAdd() {
    addWithQty(product, qty, selectedColor, selectedLength)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-gray-500 hover:text-gray-900 shadow-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row overflow-hidden flex-1 min-h-0">

            {/* Image */}
            <div className="relative w-full sm:w-72 flex-shrink-0 bg-gray-50 aspect-square sm:aspect-auto">
              {image_url ? (
                <Image
                  src={image_url}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-200" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col flex-1 overflow-y-auto p-6 gap-4">

              {/* Header */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{company}</span>
                <h2 className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{title}</h2>
                {(product_type || hair_type) && (
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {[product_type, hair_type].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                {displayPrice != null ? (
                  <>
                    <span className="text-2xl font-bold text-[#e94560]">${displayPrice.toFixed(2)}</span>
                    {minPrice !== null && maxPrice !== null && minPrice !== maxPrice && !selectedVariant && (
                      <span className="text-[11px] text-gray-400">– ${maxPrice.toFixed(2)}</span>
                    )}
                    <span className="text-[11px] text-gray-400 ml-1">/ unit</span>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">Price TBD</span>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="text-[13px] text-gray-600 leading-relaxed">{description}</p>
              )}

              {/* Colors — clickable */}
              {colors.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Color {selectedColor ? <span className="normal-case font-normal">— {selectedColor}</span> : `(${colors.length})`}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {colors.map((code) => {
                      const swatch = color_swatches.find(s => s.code === code)
                      const isSelected = selectedColor === code
                      return swatch ? (
                        <img
                          key={code}
                          src={swatch.url}
                          alt={code}
                          title={code}
                          onClick={() => setSelectedColor(isSelected ? null : code)}
                          className={`w-7 h-7 rounded-full object-cover cursor-pointer transition-all
                            ${isSelected ? 'ring-2 ring-gray-900 ring-offset-1 scale-110' : 'border border-gray-100 hover:scale-105'}`}
                        />
                      ) : (
                        <button
                          key={code}
                          title={code}
                          onClick={() => setSelectedColor(isSelected ? null : code)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all
                            ${isSelected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
                        >
                          {code}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Lengths — clickable */}
              {lengths && lengths.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Length</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lengths.map((l) => {
                      const isSelected = selectedLength === l
                      return (
                      <button key={l} onClick={() => setSelectedLength(isSelected ? null : l)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all
                          ${isSelected ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 bg-gray-50 hover:border-gray-400'}`}>
                        {l}
                      </button>
                    )})}
                  </div>
                </div>
              )}

              {/* Stock */}
              <p className={`text-[12px] font-medium ${variantQty > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                {variantQty > 0 ? `${variantQty.toLocaleString()} units in stock` : 'Out of stock'}
              </p>

              {/* Qty + Add to Cart */}
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-100">
                {/* Stepper */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[14px] font-semibold text-gray-900 w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(variantQty || 999, q + 1))}
                    disabled={variantQty === 0}
                    className="text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add button */}
                <button
                  onClick={handleAdd}
                  disabled={variantQty === 0}
                  className={`flex-1 flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-xl transition-all duration-200
                    ${variantQty === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                    }`}
                >
                  {added ? (
                    <><Check className="w-4 h-4" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add {qty > 1 ? `${qty} ` : ''}to Cart</>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
