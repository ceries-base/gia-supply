'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, X } from 'lucide-react'

export interface Filters {
  brands: Set<string>
  types: Set<string>
  hairTypes: Set<string>
}

interface Props {
  brands: string[]
  types: string[]
  hairTypes: string[]
  filters: Filters
  onChange: (filters: Filters) => void
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: string[]
  selected: Set<string>
  onToggle: (val: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-gray-100 last:border-0 pb-3 mb-3 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left text-[13px] font-semibold text-gray-700 mb-2 hover:text-gray-900"
      >
        <span>
          {label}
          {selected.size > 0 && (
            <span className="ml-1.5 bg-[#e94560] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {selected.size}
            </span>
          )}
        </span>
        {open ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
      </button>

      {open && (
        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.has(opt)}
                onChange={() => onToggle(opt)}
                className="rounded border-gray-300 text-[#e94560] focus:ring-[#e94560] w-3.5 h-3.5"
              />
              <span className="text-[12px] text-gray-600 group-hover:text-gray-900 leading-snug">
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FilterSidebar({ brands, types, hairTypes, filters, onChange }: Props) {
  const activeCount = filters.brands.size + filters.types.size + filters.hairTypes.size

  function toggle(key: keyof Filters, value: string) {
    const next = new Set(filters[key])
    if (next.has(value)) next.delete(value)
    else next.add(value)
    onChange({ ...filters, [key]: next })
  }

  function clearAll() {
    onChange({ brands: new Set(), types: new Set(), hairTypes: new Set() })
  }

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="sticky top-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-bold text-gray-800">
            Filters
            {activeCount > 0 && (
              <span className="ml-1.5 bg-[#e94560] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </span>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-0.5 text-[11px] text-gray-400 hover:text-[#e94560]"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>

        {brands.length > 0 && (
          <FilterGroup
            label="Brand"
            options={brands}
            selected={filters.brands}
            onToggle={(v) => toggle('brands', v)}
          />
        )}
        {types.length > 0 && (
          <FilterGroup
            label="Product Type"
            options={types}
            selected={filters.types}
            onToggle={(v) => toggle('types', v)}
          />
        )}
        {hairTypes.length > 0 && (
          <FilterGroup
            label="Hair Type"
            options={hairTypes}
            selected={filters.hairTypes}
            onToggle={(v) => toggle('hairTypes', v)}
          />
        )}
      </div>
    </aside>
  )
}
