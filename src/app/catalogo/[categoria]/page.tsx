'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
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

export default function CategoriaPage() {
  const params = useParams<{ categoria: string }>()
  const [sort, setSort] = useState<SortOption>('relevancia')
  const [hideOutOfStock, setHideOutOfStock] = useState(false)

  const category = useMemo(
    () => categories.find((c) => c.slug === params.categoria),
    [params.categoria]
  )

  const filtered = useMemo(() => {
    let result = category
      ? products.filter((p) => p.category === category.name)
      : []

    if (hideOutOfStock) {
      result = result.filter((p) => p.stock > 0)
    }

    return sortProducts(result, sort)
  }, [category, sort, hideOutOfStock])

  const categoryName = category?.name ?? params.categoria

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-sm text-text-muted font-body"
      >
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-text-primary"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/catalogo"
          className="transition-colors hover:text-text-primary"
        >
          Catálogo
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">{categoryName}</span>
      </nav>

      <h1 className="mb-6 text-3xl font-bold text-text-primary font-display">
        {categoryName}
      </h1>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Pill active={false}>
          <Link href="/catalogo">Todos</Link>
        </Pill>
        {categories.map((cat) => (
          <Pill key={cat.id} active={cat.slug === params.categoria}>
            <Link href={`/catalogo/${cat.slug}`}>{cat.name}</Link>
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
