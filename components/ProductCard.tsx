'use client'

import Image from 'next/image'
import { Package } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import ProductModal from './ProductModal'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const {
    company,
    title,
    description,
    product_type,
    hair_type,
    image_url,
    color_swatches,
    price,
    comp_price,
    total_qty,
    lengths,
  } = product

  const [modalOpen, setModalOpen] = useState(false)

  const displayPrice = comp_price ?? price

  return (
    <>
    {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    <div
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer"
      onClick={() => setModalOpen(true)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-200" />
          </div>
        )}
        {/* Brand pill */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm max-w-[75%] truncate tracking-wide uppercase">
          {company}
        </span>
        {/* Out of stock overlay */}
        {total_qty === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white text-gray-500 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-[13px] leading-snug text-gray-900 line-clamp-2">
          {title}
        </h3>

        {description && (
          <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">{description}</p>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-2">
          {displayPrice != null ? (
            <>
              <span className="text-[#e94560] font-bold text-base">${displayPrice.toFixed(2)}</span>
              {comp_price != null && price != null && price !== comp_price && (
                <span className="text-gray-300 text-xs line-through">${price.toFixed(2)}</span>
              )}
            </>
          ) : (
            <span className="text-gray-400 text-sm">Price TBD</span>
          )}
        </div>

        {/* Swatches */}
        {color_swatches.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {color_swatches.slice(0, 8).map(({ code, url }) => (
              <img
                key={code}
                src={url}
                alt={code}
                title={code}
                className="w-5 h-5 rounded-full object-cover border border-gray-100"
              />
            ))}
            {color_swatches.length > 8 && (
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center">
                +{color_swatches.length - 8}
              </span>
            )}
          </div>
        )}

        {/* Variant stock breakdown */}
        {product.variant_details.length > 0 && (
          <div className="max-h-24 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-50">
            {product.variant_details.map((v, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1 text-[10px]">
                <span className="text-gray-600 truncate max-w-[75%]">
                  {v.color}{v.length ? ` · ${v.length}` : ''}
                </span>
                <span className={`font-semibold tabular-nums ${v.qty > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
                  {v.qty}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Length pills */}
        {lengths && lengths.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lengths.map((l) => (
              <span key={l} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 bg-gray-50">
                {l}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col gap-0.5">
            {(product_type || hair_type) && (
              <span className="text-gray-400 text-[11px]">
                {[product_type, hair_type].filter(Boolean).join(' · ')}
              </span>
            )}
            <span className={`text-[11px] font-medium ${total_qty > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
              {total_qty > 0
                ? `${total_qty.toLocaleString()} in stock · ${product.variant_details.length} variant${product.variant_details.length === 1 ? '' : 's'}`
                : 'Out of stock'}
            </span>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}
