'use client'

import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { products } from '@/data/products'
import { ProductGrid } from '@/components/catalog/product-grid'
import { Skeleton } from '@/components/ui/skeleton'

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function BuscaContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const results = useMemo(() => {
    if (!query.trim()) return []

    const term = normalize(query)

    return products.filter((p) => {
      const haystack = normalize(
        `${p.name} ${p.brand} ${p.category} ${(p.tags ?? []).join(' ')}`
      )
      return haystack.includes(term)
    })
  }, [query])

  return (
    <>
      {query.trim() ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary font-display">
              Resultados para &ldquo;{query}&rdquo;
            </h1>
            <p className="mt-1 text-sm text-text-muted font-body">
              {results.length}{' '}
              {results.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>
          <ProductGrid products={results} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Search className="h-12 w-12 text-text-muted" />
          <p className="text-lg font-medium text-text-secondary font-body">
            Digite um termo para explorar produtos
          </p>
          <p className="text-sm text-text-muted font-body">
            Pesquise por nome, marca ou categoria.
          </p>
        </div>
      )}
    </>
  )
}

export default function BuscaPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" rounded="xl" />
              ))}
            </div>
          </div>
        }
      >
        <BuscaContent />
      </Suspense>
    </main>
  )
}
