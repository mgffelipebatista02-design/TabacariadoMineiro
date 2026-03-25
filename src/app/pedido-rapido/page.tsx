'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Search, RefreshCw, ShoppingCart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CsvImport, type CsvImportRow } from '@/components/b2b/csv-import'
import { products } from '@/data/products'
import { orders } from '@/data/orders'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/contexts/auth-context'
import { formatBRL, cn } from '@/lib/utils'
import { B2B_MIN_ORDER, CATEGORIES } from '@/lib/constants'

const B2B_CUSTOMER_IDS = ['cust-013', 'cust-015', 'cust-017', 'cust-019']

export default function PedidoRapidoPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { addItem } = useCart()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const parentRef = useRef<HTMLDivElement>(null)

  // Auth check
  useEffect(() => {
    if (!authLoading && (!user.isAuthenticated || user.role !== 'b2b')) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // Filtered products
  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim()
    return products.filter((p) => {
      const matchSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term)
      const matchCategory = !categoryFilter || p.category === categoryFilter
      return matchSearch && matchCategory
    })
  }, [search, categoryFilter])

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  })

  // Total calculations
  const totalItems = useMemo(
    () => Object.values(quantities).reduce((sum, q) => sum + (q > 0 ? q : 0), 0),
    [quantities]
  )

  const totalValue = useMemo(() => {
    let total = 0
    for (const [productId, qty] of Object.entries(quantities)) {
      if (qty <= 0) continue
      const product = products.find((p) => p.id === productId)
      if (product) {
        total += product.priceB2B * qty
      }
    }
    return total
  }, [quantities])

  const progress = Math.min((totalValue / B2B_MIN_ORDER) * 100, 100)
  const minOrderMet = totalValue >= B2B_MIN_ORDER

  // Set quantity for a product
  const setQty = useCallback((productId: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(0, value) }))
  }, [])

  // CSV import handler
  const handleCsvImport = useCallback((data: CsvImportRow[]) => {
    const newQuantities: Record<string, number> = {}
    for (const row of data) {
      const product = products.find(
        (p) => p.id === row.sku || p.slug === row.sku
      )
      if (product) {
        newQuantities[product.id] = row.quantidade
      }
    }
    setQuantities((prev) => ({ ...prev, ...newQuantities }))
  }, [])

  // Repeat last order
  const handleRepeatLastOrder = useCallback(() => {
    const b2bOrders = orders
      .filter((o) => B2B_CUSTOMER_IDS.includes(o.customerId))
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )

    const lastOrder = b2bOrders[0]
    if (!lastOrder) return

    const newQuantities: Record<string, number> = {}
    for (const item of lastOrder.items) {
      newQuantities[item.productId] = item.quantity
    }
    setQuantities((prev) => ({ ...prev, ...newQuantities }))
  }, [])

  // Submit order
  const handleSubmit = useCallback(() => {
    for (const [productId, qty] of Object.entries(quantities)) {
      if (qty <= 0) continue
      const product = products.find((p) => p.id === productId)
      if (!product) continue

      addItem({
        productId: product.id,
        quantity: qty,
        name: product.name,
        price: product.priceB2B,
        image: product.images[0] || '/images/products/placeholder.jpg',
        unit: product.unitB2B,
      })
    }

    router.push('/carrinho')
  }, [quantities, addItem, router])

  if (authLoading || !user.isAuthenticated || user.role !== 'b2b') {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 pb-32">
      <h1 className="font-display text-2xl text-text-primary mb-6">
        Pedido Rapido
      </h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por codigo, nome ou marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <CsvImport onImport={handleCsvImport} />
          <Button variant="secondary" size="md" onClick={handleRepeatLastOrder}>
            <RefreshCw className="h-4 w-4" />
            Repetir Ultimo Pedido
          </Button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoryFilter('')}
          className={cn(
            'px-3 py-1.5 rounded-[--radius-pill] text-sm font-medium transition-colors',
            !categoryFilter
              ? 'bg-accent-green text-bg-primary'
              : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
          )}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setCategoryFilter(categoryFilter === cat ? '' : cat)
            }
            className={cn(
              'px-3 py-1.5 rounded-[--radius-pill] text-sm font-medium transition-colors',
              categoryFilter === cat
                ? 'bg-accent-green text-bg-primary'
                : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table header */}
      <Card padding="none">
        <div className="grid grid-cols-[80px_1fr_120px_100px_80px_120px] gap-2 px-4 py-2 border-b border-border-default text-xs font-medium text-text-muted uppercase tracking-wider">
          <div>Codigo</div>
          <div>Nome</div>
          <div>Categoria</div>
          <div className="text-right">Preco B2B</div>
          <div className="text-right">Estoque</div>
          <div className="text-right">Quantidade</div>
        </div>

        {/* Virtualized rows */}
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{ height: '500px' }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const product = filteredProducts[virtualRow.index]
              const qty = quantities[product.id] || 0

              return (
                <div
                  key={product.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={cn(
                    'grid grid-cols-[80px_1fr_120px_100px_80px_120px] gap-2 px-4 items-center border-b border-border-default text-sm',
                    qty > 0 && 'bg-accent-green/5'
                  )}
                >
                  <div className="font-mono text-xs text-text-muted truncate">
                    {product.id}
                  </div>
                  <div className="truncate text-text-primary font-medium">
                    {product.name}
                  </div>
                  <div className="text-text-secondary text-xs">
                    {product.category}
                  </div>
                  <div className="text-right font-medium">
                    {formatBRL(product.priceB2B)}
                  </div>
                  <div className="text-right">
                    {product.stock > 20 ? (
                      <span className="text-text-secondary">{product.stock}</span>
                    ) : product.stock > 0 ? (
                      <Badge variant="olive">{product.stock}</Badge>
                    ) : (
                      <Badge variant="red">0</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <input
                      type="number"
                      min={0}
                      value={qty || ''}
                      onChange={(e) =>
                        setQty(product.id, parseInt(e.target.value, 10) || 0)
                      }
                      placeholder="0"
                      className="w-20 h-8 ml-auto rounded-[--radius-md] bg-bg-input border border-border-default px-2 text-sm text-text-primary text-right focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="text-center text-text-muted py-8">
          Nenhum produto encontrado.
        </div>
      )}

      {/* Sticky footer bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border-default px-4 py-4 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-text-secondary">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'} |{' '}
                {formatBRL(totalValue)}
              </span>
              <span className="text-text-muted">
                Min. {formatBRL(B2B_MIN_ORDER)}
              </span>
            </div>
            <div className="w-full h-2 bg-bg-elevated rounded-[--radius-pill] overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-[--radius-pill] transition-all duration-300',
                  minOrderMet ? 'bg-status-success' : 'bg-accent-green'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={totalItems === 0 || !minOrderMet}
            onClick={handleSubmit}
          >
            <ShoppingCart className="h-5 w-5" />
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  )
}
