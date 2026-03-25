'use client'

import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SortOption = 'relevancia' | 'menor-preco' | 'maior-preco' | 'nome-az'

const sortLabels: Record<SortOption, string> = {
  relevancia: 'Relevância',
  'menor-preco': 'Menor preço',
  'maior-preco': 'Maior preço',
  'nome-az': 'Nome A-Z',
}

export interface FiltersProps {
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  hideOutOfStock: boolean
  onStockFilterChange: (hide: boolean) => void
}

function Filters({
  sort,
  onSortChange,
  hideOutOfStock,
  onStockFilterChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Sort dropdown */}
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={cn(
            'h-10 appearance-none rounded-[--radius-md] border border-border-default bg-bg-input px-4 pr-9 text-sm font-body text-text-primary',
            'transition-colors hover:border-border-hover focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/25'
          )}
        >
          {(Object.keys(sortLabels) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {sortLabels[key]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      </div>

      {/* Stock toggle */}
      <button
        type="button"
        onClick={() => onStockFilterChange(!hideOutOfStock)}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-[--radius-md] border px-4 text-sm font-body transition-colors',
          hideOutOfStock
            ? 'border-accent-green bg-accent-green/10 text-accent-green'
            : 'border-border-default bg-bg-input text-text-secondary hover:border-border-hover hover:text-text-primary'
        )}
      >
        {hideOutOfStock ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        {hideOutOfStock ? 'Ocultar indisponíveis' : 'Mostrar todos'}
      </button>
    </div>
  )
}

export { Filters }
