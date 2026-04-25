'use client'

import { useMemo, useState, useEffect } from 'react'
import { Search, X, ShoppingBag, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/ProductCard'
import FilterBar from '@/components/FilterBar'
import CartDrawer from '@/components/CartDrawer'
import { useCart } from '@/lib/cart'

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<{ brands: Set<string>; types: Set<string>; hairTypes: Set<string> }>({
    brands: new Set(),
    types: new Set(),
    hairTypes: new Set(),
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc' | 'stock-desc'>('default')

  const { totalItems } = useCart()

  // Fetch products from OMS
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoadingProducts(false) })
      .catch(() => setLoadingProducts(false))
  }, [])

  const allBrands = useMemo(() => Array.from(new Set(products.map(p => p.company).filter(Boolean))).sort(), [products])
  const allTypes = useMemo(() => Array.from(new Set(products.map(p => p.product_type).filter(Boolean) as string[])).sort(), [products])
  const allHairTypes = useMemo(() => Array.from(new Set(products.map(p => p.hair_type).filter(Boolean) as string[])).sort(), [products])

  // Restore state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) setQuery(q)
    const brands = params.getAll('brand')
    const types = params.getAll('type')
    const hair = params.getAll('hair')
    if (brands.length || types.length || hair.length) {
      setFilters({ brands: new Set(brands), types: new Set(types), hairTypes: new Set(hair) })
    }
    const s = params.get('sort')
    if (s) setSort(s as typeof sort)
  }, [])

  // Sync state → URL on change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    filters.brands.forEach((b) => params.append('brand', b))
    filters.types.forEach((t) => params.append('type', t))
    filters.hairTypes.forEach((h) => params.append('hair', h))
    if (sort !== 'default') params.set('sort', sort)
    const str = params.toString()
    window.history.replaceState(null, '', str ? `?${str}` : window.location.pathname)
  }, [query, filters, sort])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = products.filter((p) => {
      if (filters.brands.size > 0 && !filters.brands.has(p.company)) return false
      if (filters.types.size > 0 && (!p.product_type || !filters.types.has(p.product_type))) return false
      if (filters.hairTypes.size > 0 && (!p.hair_type || !filters.hairTypes.has(p.hair_type))) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        (p.product_type?.toLowerCase().includes(q) ?? false) ||
        (p.hair_type?.toLowerCase().includes(q) ?? false) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        p.colors.some((c) => c.toLowerCase().includes(q))
      )
    })
    if (sort === 'price-asc') return [...base].sort((a, b) => (a.comp_price ?? a.price ?? 999) - (b.comp_price ?? b.price ?? 999))
    if (sort === 'price-desc') return [...base].sort((a, b) => (b.comp_price ?? b.price ?? 0) - (a.comp_price ?? a.price ?? 0))
    if (sort === 'stock-desc') return [...base].sort((a, b) => b.total_qty - a.total_qty)
    return base
  }, [query, filters, sort])

  const activeFilterCount = filters.brands.size + filters.types.size + filters.hairTypes.size

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* ── Announcement Bar ── */}
      <div className="bg-gray-900 text-white text-center text-[11px] font-medium py-2 tracking-wide">
        Gia Supply &nbsp;·&nbsp; Wholesale B2B Portal &nbsp;·&nbsp; Contact us for custom pallet orders
      </div>

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-xl font-black text-gray-900 tracking-tight leading-none">Gia Supply</div>
            <div className="text-[9px] text-gray-400 font-semibold tracking-[0.15em] uppercase mt-0.5">Wholesale Beauty</div>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-3 py-2.5"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Orders</span>
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#e94560] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════ CATALOGUE ══════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-5 py-5">

          {/* Search row */}
          <div className="relative max-w-lg mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, colors…"
              className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 placeholder:text-gray-400 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter bar */}
          <div className="mb-5">
            <FilterBar
              brands={allBrands}
              types={allTypes}
              hairTypes={allHairTypes}
              filters={filters}
              onChange={setFilters}
            />
          </div>

          {/* Result count + sort */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] text-gray-500">
              {query || activeFilterCount > 0
                ? `${filtered.length.toLocaleString()} results`
                : `${products.length.toLocaleString()} products`}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-[12px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="stock-desc">Stock: High → Low</option>
            </select>
          </div>

          {/* Grid — full width now */}
          {loadingProducts ? (
            <div className="flex items-center justify-center py-24 text-gray-300">
              <Search className="w-6 h-6 animate-pulse opacity-40" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Search className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No products found</p>
              <p className="text-xs mt-1">Try different search terms or clear filters</p>
            </div>
          ) : null}
          {!loadingProducts && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={`${p.company}-${p.title}-${i}`} product={p} />
              ))}
            </div>
          )}
        </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
