'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import type { Filters } from './FilterSidebar'

interface Props {
  brands: string[]
  types: string[]
  hairTypes: string[]
  filters: Filters
  onChange: (filters: Filters) => void
}

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string
  options: string[]
  selected: Set<string>
  onToggle: (v: string) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const count = selected.size

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg border transition-colors ${
          count > 0
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
        }`}
      >
        {label}
        {count > 0 && (
          <span className="bg-white/20 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            {count > 0 && (
              <button onClick={onClear} className="text-[11px] text-[#e94560] font-semibold hover:underline">
                Clear
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 group"
              >
                <input
                  type="checkbox"
                  checked={selected.has(opt)}
                  onChange={() => onToggle(opt)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                />
                <span className="text-[13px] text-gray-700 group-hover:text-gray-900 leading-snug">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FilterBar({ brands, types, hairTypes, filters, onChange }: Props) {
  function toggle(key: keyof Filters, value: string) {
    const next = new Set(filters[key])
    if (next.has(value)) next.delete(value)
    else next.add(value)
    onChange({ ...filters, [key]: next })
  }

  function clearKey(key: keyof Filters) {
    onChange({ ...filters, [key]: new Set() })
  }

  function clearAll() {
    onChange({ brands: new Set(), types: new Set(), hairTypes: new Set() })
  }

  const activeCount = filters.brands.size + filters.types.size + filters.hairTypes.size
  const activePills: { label: string; key: keyof Filters; value: string }[] = [
    ...Array.from(filters.brands).map((v) => ({ label: v, key: 'brands' as const, value: v })),
    ...Array.from(filters.types).map((v) => ({ label: v, key: 'types' as const, value: v })),
    ...Array.from(filters.hairTypes).map((v) => ({ label: v, key: 'hairTypes' as const, value: v })),
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {brands.length > 0 && (
          <FilterDropdown
            label="Brand"
            options={brands}
            selected={filters.brands}
            onToggle={(v) => toggle('brands', v)}
            onClear={() => clearKey('brands')}
          />
        )}
        {types.length > 0 && (
          <FilterDropdown
            label="Product Type"
            options={types}
            selected={filters.types}
            onToggle={(v) => toggle('types', v)}
            onClear={() => clearKey('types')}
          />
        )}
        {hairTypes.length > 0 && (
          <FilterDropdown
            label="Hair Type"
            options={hairTypes}
            selected={filters.hairTypes}
            onToggle={(v) => toggle('hairTypes', v)}
            onClear={() => clearKey('hairTypes')}
          />
        )}
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[12px] text-gray-400 hover:text-gray-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activePills.map(({ label, key, value }) => (
            <button
              key={`${key}-${value}`}
              onClick={() => toggle(key, value)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12px] font-medium px-2.5 py-1 rounded-full transition-colors"
            >
              {label}
              <X className="w-3 h-3 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
