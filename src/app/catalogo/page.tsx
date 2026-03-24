'use client'

import { useMemo, useState } from 'react'
import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { Pill } from '@/components/ui/pill'
import { Filters, type SortOption } from '@/components/catalog/filters'
import { ProductGrid } from '@/components/catalog/product-grid'

function sortProducts(list: typeof products, sort: SortOption) {
  const sorted = [...list]
  switch (sort) {
    case 'menor-preco':
      return sorted.sort((a, b) => a.priceB2C - b.priceB2C)
    case 'maior-preco':
      return sorted.sort((a, b) => b.priceB2C - a.priceB2C)
    case 'nome-az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    default:
      return sorted
  }
}

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [sort, setSort] = useState<SortOption>('relevancia')
  const [hideOutOfStock, setHideOutOfStock] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'todos') {
      const cat = categories.find((c) => c.slug === selectedCategory)
      if (cat) {
        result = result.filter((p) => p.category === cat.name)
      }
    }

    if (hideOutOfStock) {
      result = result.filter((p) => p.stock > 0)
    }

    return sortProducts(result, sort)
  }, [selectedCategory, sort, hideOutOfStock])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-text-primary font-display">
        Catálogo
      </h1>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Pill
          active={selectedCategory === 'todos'}
          onClick={() => setSelectedCategory('todos')}
        >
          Todos
        </Pill>
        {categories.map((cat) => (
          <Pill
            key={cat.id}
            active={selectedCategory === cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </Pill>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Filters
          sort={sort}
          onSortChange={setSort}
          hideOutOfStock={hideOutOfStock}
          onStockFilterChange={setHideOutOfStock}
        />
      </div>

      {/* Product grid */}
      <ProductGrid products={filtered} />
    </main>
  )
}
