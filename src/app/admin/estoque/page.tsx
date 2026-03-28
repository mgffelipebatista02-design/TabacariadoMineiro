'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Search,
  Plus,
  Pencil,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PackagePlus,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Package,
} from 'lucide-react'
import { cn, formatBRL, slugify } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import { products as initialProducts } from '@/data/products'
import { stockMovements as initialMovements } from '@/data/stock-movements'
import type { Product, Category, StockMovement, StockMovementType } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Pill } from '@/components/ui/pill'
import { Modal } from '@/components/ui/modal'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

// ─── Constants ───────────────────────────────────────────────
const STORAGE_KEY_PRODUCTS = 'tabacaria-estoque-products'
const STORAGE_KEY_MOVEMENTS = 'tabacaria-estoque-movements'
const LOW_STOCK_THRESHOLD = 20

type Tab = 'produtos' | 'movimentacoes' | 'alertas'
type SortField = 'name' | 'category' | 'priceB2C' | 'priceB2B' | 'stock'
type SortDir = 'asc' | 'desc'

// ─── Zod Schemas ─────────────────────────────────────────────
const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  priceB2C: z.number().positive('Preço B2C deve ser maior que 0'),
  priceB2B: z.number().positive('Preço B2B deve ser maior que 0'),
  unitB2C: z.string().min(1, 'Unidade B2C é obrigatória'),
  unitB2B: z.string().min(1, 'Unidade B2B é obrigatória'),
  minQtyB2B: z.number().int().min(1, 'Quantidade mínima deve ser ao menos 1'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  description: z.string().min(1, 'Descrição é obrigatória'),
})

type ProductFormData = z.infer<typeof productSchema>

const adjustSchema = z.object({
  type: z.enum(['entrada', 'saida', 'ajuste']),
  quantity: z.number().int().positive('Quantidade deve ser maior que 0'),
  reason: z.string().min(1, 'Motivo é obrigatório'),
})

type AdjustFormData = z.infer<typeof adjustSchema>

// ─── Helpers ─────────────────────────────────────────────────
function getStockStatus(stock: number) {
  if (stock === 0) return { label: 'Esgotado', variant: 'red' as const }
  if (stock <= LOW_STOCK_THRESHOLD) return { label: 'Baixo', variant: 'olive' as const }
  return { label: 'Normal', variant: 'green' as const }
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`
}

// ─── Page Component ──────────────────────────────────────────
export default function EstoquePage() {
  const [activeTab, setActiveTab] = useState<Tab>('produtos')
  const [productsList, setProductsList] = useState<Product[]>(initialProducts)
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS)
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts)
        if (Array.isArray(parsed)) setProductsList(parsed)
      }
      const storedMovements = localStorage.getItem(STORAGE_KEY_MOVEMENTS)
      if (storedMovements) {
        const parsed = JSON.parse(storedMovements)
        if (Array.isArray(parsed)) setMovements(parsed)
      }
    } catch {
      // ignore corrupt data
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(productsList))
      localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements))
    }
  }, [productsList, movements, hydrated])

  const addProduct = useCallback((product: Product) => {
    setProductsList((prev) => [...prev, product])
  }, [])

  const updateProduct = useCallback((updated: Product) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }, [])

  const addMovement = useCallback((movement: StockMovement) => {
    setMovements((prev) => [movement, ...prev])
  }, [])

  const adjustStock = useCallback(
    (productId: string, type: StockMovementType, quantity: number, reason: string) => {
      setProductsList((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p
          const previousStock = p.stock
          let newStock = previousStock
          if (type === 'entrada') newStock = previousStock + quantity
          else if (type === 'saida') newStock = Math.max(0, previousStock - quantity)
          else newStock = Math.max(0, previousStock + quantity) // ajuste pode ser +/-

          addMovement({
            id: generateId('mov'),
            productId: p.id,
            productName: p.name,
            type,
            quantity,
            reason,
            date: new Date().toISOString(),
            previousStock,
            newStock,
          })

          return { ...p, stock: newStock }
        })
      )
    },
    [addMovement]
  )

  const tabs: { key: Tab; label: string }[] = [
    { key: 'produtos', label: 'Produtos' },
    { key: 'movimentacoes', label: 'Movimentações' },
    { key: 'alertas', label: 'Alertas' },
  ]

  const alertCount = useMemo(
    () => productsList.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).length,
    [productsList]
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Gestão de Estoque
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Cadastre produtos, controle entradas e saídas, e monitore níveis de estoque.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-default pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'text-accent-green'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.key === 'alertas' && alertCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-status-error px-1 text-[10px] font-bold text-white">
                  {alertCount}
                </span>
              )}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-green rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'produtos' && (
        <ProductsTab
          products={productsList}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onAdjustStock={adjustStock}
        />
      )}
      {activeTab === 'movimentacoes' && (
        <MovementsTab movements={movements} />
      )}
      {activeTab === 'alertas' && (
        <AlertsTab products={productsList} onAdjustStock={adjustStock} />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Products Tab
// ═══════════════════════════════════════════════════════════════
function ProductsTab({
  products,
  onAddProduct,
  onUpdateProduct,
  onAdjustStock,
}: {
  products: Product[]
  onAddProduct: (p: Product) => void
  onUpdateProduct: (p: Product) => void
  onAdjustStock: (id: string, type: StockMovementType, qty: number, reason: string) => void
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    let list = products
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      )
    }
    if (categoryFilter !== 'Todas') {
      list = list.filter((p) => p.category === categoryFilter)
    }
    list = [...list].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc'
          ? aVal.localeCompare(bVal, 'pt-BR')
          : bVal.localeCompare(aVal, 'pt-BR')
      }
      return sortDir === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })
    return list
  }, [products, search, categoryFilter, sortField, sortDir])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-text-muted" />
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-accent-green" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-accent-green" />
    )
  }

  function openNewProduct() {
    setEditingProduct(null)
    setProductModalOpen(true)
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product)
    setProductModalOpen(true)
  }

  function openAdjust(product: Product) {
    setAdjustingProduct(product)
    setAdjustModalOpen(true)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Input
            placeholder="Buscar por nome, marca ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="max-w-sm"
          />
        </div>
        <Button onClick={openNewProduct} size="md">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <Pill
          active={categoryFilter === 'Todas'}
          onClick={() => setCategoryFilter('Todas')}
        >
          Todas
        </Pill>
        {CATEGORIES.map((cat) => (
          <Pill
            key={cat}
            active={categoryFilter === cat}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </Pill>
        ))}
      </div>

      {/* Products Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('name')}
              >
                <span className="flex items-center gap-1">
                  Produto <SortIcon field="name" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('category')}
              >
                <span className="flex items-center gap-1">
                  Categoria <SortIcon field="category" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort('priceB2C')}
              >
                <span className="flex items-center justify-end gap-1">
                  Preço B2C <SortIcon field="priceB2C" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort('priceB2B')}
              >
                <span className="flex items-center justify-end gap-1">
                  Preço B2B <SortIcon field="priceB2B" />
                </span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort('stock')}
              >
                <span className="flex items-center justify-end gap-1">
                  Estoque <SortIcon field="stock" />
                </span>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-text-muted">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => {
                const status = getStockStatus(product.stock)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text-primary">{product.name}</p>
                        <p className="text-xs text-text-muted font-mono">{product.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right font-mono text-text-primary">
                      {formatBRL(product.priceB2C)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-text-primary">
                      {formatBRL(product.priceB2B)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-text-primary">
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditProduct(product)}
                          title="Editar produto"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openAdjust(product)}
                          title="Ajustar estoque"
                        >
                          <PackagePlus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Product Modal (New/Edit) */}
      <ProductModal
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        product={editingProduct}
        onSave={(data, isNew) => {
          if (isNew) {
            onAddProduct(data)
          } else {
            onUpdateProduct(data)
          }
          setProductModalOpen(false)
        }}
      />

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <AdjustModal
          open={adjustModalOpen}
          onOpenChange={setAdjustModalOpen}
          product={adjustingProduct}
          onConfirm={(type, quantity, reason) => {
            onAdjustStock(adjustingProduct.id, type, quantity, reason)
            setAdjustModalOpen(false)
          }}
        />
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// Movements Tab
// ═══════════════════════════════════════════════════════════════
function MovementsTab({ movements }: { movements: StockMovement[] }) {
  const [typeFilter, setTypeFilter] = useState<StockMovementType | 'todos'>('todos')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = movements
    if (typeFilter !== 'todos') {
      list = list.filter((m) => m.type === typeFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((m) => m.productName.toLowerCase().includes(q))
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [movements, typeFilter, search])

  const movementBadge: Record<StockMovementType, { label: string; variant: 'green' | 'red' | 'blue' }> = {
    entrada: { label: 'Entrada', variant: 'green' },
    saida: { label: 'Saída', variant: 'red' },
    ajuste: { label: 'Ajuste', variant: 'blue' },
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Buscar por produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Pill active={typeFilter === 'todos'} onClick={() => setTypeFilter('todos')}>
            Todos
          </Pill>
          <Pill active={typeFilter === 'entrada'} onClick={() => setTypeFilter('entrada')}>
            Entradas
          </Pill>
          <Pill active={typeFilter === 'saida'} onClick={() => setTypeFilter('saida')}>
            Saídas
          </Pill>
          <Pill active={typeFilter === 'ajuste'} onClick={() => setTypeFilter('ajuste')}>
            Ajustes
          </Pill>
        </div>
      </div>

      {/* Movements Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Qtd</TableHead>
              <TableHead className="text-right">Anterior</TableHead>
              <TableHead className="text-right">Novo</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-text-muted">
                  Nenhuma movimentação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((mov) => {
                const badge = movementBadge[mov.type]
                const date = new Date(mov.date)
                return (
                  <TableRow key={mov.id}>
                    <TableCell className="whitespace-nowrap text-text-secondary text-xs">
                      <div>
                        {date.toLocaleDateString('pt-BR')}
                        <br />
                        <span className="text-text-muted">
                          {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-text-primary">{mov.productName}</p>
                      <p className="text-xs text-text-muted font-mono">{mov.productId}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      <span
                        className={cn(
                          mov.type === 'entrada' && 'text-status-success',
                          mov.type === 'saida' && 'text-status-error',
                          mov.type === 'ajuste' && 'text-status-info'
                        )}
                      >
                        {mov.type === 'entrada' ? '+' : mov.type === 'saida' ? '-' : '±'}
                        {mov.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-text-muted">
                      {mov.previousStock}
                    </TableCell>
                    <TableCell className="text-right font-mono text-text-primary font-semibold">
                      {mov.newStock}
                    </TableCell>
                    <TableCell className="text-text-secondary text-sm max-w-[200px] truncate">
                      {mov.reason}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Alerts Tab
// ═══════════════════════════════════════════════════════════════
function AlertsTab({
  products,
  onAdjustStock,
}: {
  products: Product[]
  onAdjustStock: (id: string, type: StockMovementType, qty: number, reason: string) => void
}) {
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null)

  const lowStock = useMemo(
    () =>
      products
        .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.stock - b.stock),
    [products]
  )

  if (lowStock.length === 0) {
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10">
            <Package className="h-8 w-8 text-status-success" />
          </div>
          <h3 className="font-display text-lg font-semibold text-text-primary">
            Estoque em dia
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Todos os produtos estão com estoque acima de {LOW_STOCK_THRESHOLD} unidades.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lowStock.map((product) => {
          const isOut = product.stock === 0
          return (
            <Card key={product.id} padding="md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-[--radius-md]',
                      isOut ? 'bg-status-error/10' : 'bg-status-warning/10'
                    )}
                  >
                    {isOut ? (
                      <AlertTriangle className="h-5 w-5 text-status-error" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-status-warning" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{product.name}</p>
                    <p className="text-xs text-text-muted">{product.category}</p>
                  </div>
                </div>
                <Badge variant={isOut ? 'red' : 'olive'}>
                  {isOut ? 'Esgotado' : 'Baixo'}
                </Badge>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted">Estoque atual</p>
                  <p
                    className={cn(
                      'text-2xl font-bold font-mono',
                      isOut ? 'text-status-error' : 'text-status-warning'
                    )}
                  >
                    {product.stock}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setAdjustingProduct(product)
                    setAdjustModalOpen(true)
                  }}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Repor
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {adjustingProduct && (
        <AdjustModal
          open={adjustModalOpen}
          onOpenChange={setAdjustModalOpen}
          product={adjustingProduct}
          onConfirm={(type, quantity, reason) => {
            onAdjustStock(adjustingProduct.id, type, quantity, reason)
            setAdjustModalOpen(false)
          }}
        />
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// Product Modal (New / Edit)
// ═══════════════════════════════════════════════════════════════
function ProductModal({
  open,
  onOpenChange,
  product,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (product: Product, isNew: boolean) => void
}) {
  const isNew = !product

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          brand: product.brand,
          category: product.category,
          priceB2C: product.priceB2C,
          priceB2B: product.priceB2B,
          unitB2C: product.unitB2C,
          unitB2B: product.unitB2B,
          minQtyB2B: product.minQtyB2B,
          stock: product.stock,
          description: product.description,
        }
      : {
          unitB2C: 'unidade',
          unitB2B: 'caixa',
          minQtyB2B: 10,
          stock: 0,
        },
  })

  // Reset form when product changes
  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          brand: product.brand,
          category: product.category,
          priceB2C: product.priceB2C,
          priceB2B: product.priceB2B,
          unitB2C: product.unitB2C,
          unitB2B: product.unitB2B,
          minQtyB2B: product.minQtyB2B,
          stock: product.stock,
          description: product.description,
        })
      } else {
        reset({
          name: '',
          brand: '',
          category: '',
          priceB2C: undefined,
          priceB2B: undefined,
          unitB2C: 'unidade',
          unitB2B: 'caixa',
          minQtyB2B: 10,
          stock: 0,
          description: '',
        })
      }
    }
  }, [open, product, reset])

  function onSubmit(data: ProductFormData) {
    if (isNew) {
      const newProduct: Product = {
        id: generateId('prod'),
        slug: slugify(data.name),
        name: data.name,
        brand: data.brand,
        category: data.category as Category,
        description: data.description,
        specifications: {},
        priceB2C: data.priceB2C,
        priceB2B: data.priceB2B,
        unitB2C: data.unitB2C,
        unitB2B: data.unitB2B,
        minQtyB2B: data.minQtyB2B,
        stock: data.stock,
        images: ['/images/products/placeholder.jpg'],
        rating: 0,
        reviewCount: 0,
        featured: false,
        tags: [],
      }
      onSave(newProduct, true)
    } else {
      const updated: Product = {
        ...product!,
        name: data.name,
        brand: data.brand,
        category: data.category as Category,
        description: data.description,
        priceB2C: data.priceB2C,
        priceB2B: data.priceB2B,
        unitB2C: data.unitB2C,
        unitB2B: data.unitB2B,
        minQtyB2B: data.minQtyB2B,
        stock: data.stock,
      }
      onSave(updated, false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isNew ? 'Novo Produto' : 'Editar Produto'}
      description={isNew ? 'Preencha os dados para cadastrar um novo produto.' : `Editando: ${product?.name}`}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        {/* Row 1: Name + Brand */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome do Produto"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Marca"
            {...register('brand')}
            error={errors.brand?.message}
          />
        </div>

        {/* Row 2: Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Categoria
          </label>
          <select
            {...register('category')}
            className={cn(
              'flex h-10 w-full rounded-[--radius-md] bg-bg-input border border-border-default px-3 py-2 text-sm text-text-primary transition-colors duration-200 focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green',
              errors.category && 'border-status-error focus:border-status-error focus:ring-status-error'
            )}
          >
            <option value="">Selecione uma categoria</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-status-error">{errors.category.message}</p>
          )}
        </div>

        {/* Row 3: Prices */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Preço B2C (R$)"
            type="number"
            step="0.01"
            {...register('priceB2C', { valueAsNumber: true })}
            error={errors.priceB2C?.message}
          />
          <Input
            label="Preço B2B (R$)"
            type="number"
            step="0.01"
            {...register('priceB2B', { valueAsNumber: true })}
            error={errors.priceB2B?.message}
          />
        </div>

        {/* Row 4: Units + MinQty */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Unidade B2C"
            {...register('unitB2C')}
            error={errors.unitB2C?.message}
          />
          <Input
            label="Unidade B2B"
            {...register('unitB2B')}
            error={errors.unitB2B?.message}
          />
          <Input
            label="Qtd Mínima B2B"
            type="number"
            {...register('minQtyB2B', { valueAsNumber: true })}
            error={errors.minQtyB2B?.message}
          />
        </div>

        {/* Row 5: Stock */}
        <Input
          label="Estoque Inicial"
          type="number"
          {...register('stock', { valueAsNumber: true })}
          error={errors.stock?.message}
        />

        {/* Row 6: Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Descrição
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className={cn(
              'flex w-full rounded-[--radius-md] bg-bg-input border border-border-default px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green resize-none',
              errors.description && 'border-status-error focus:border-status-error focus:ring-status-error'
            )}
            placeholder="Descrição do produto..."
          />
          {errors.description && (
            <p className="text-xs text-status-error">{errors.description.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {isNew ? 'Cadastrar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ═══════════════════════════════════════════════════════════════
// Adjust Stock Modal
// ═══════════════════════════════════════════════════════════════
function AdjustModal({
  open,
  onOpenChange,
  product,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  onConfirm: (type: StockMovementType, quantity: number, reason: string) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustFormData>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      type: 'entrada',
      quantity: undefined,
      reason: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({ type: 'entrada', quantity: undefined, reason: '' })
    }
  }, [open, reset])

  function onSubmit(data: AdjustFormData) {
    onConfirm(data.type, data.quantity, data.reason)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ajustar Estoque"
      description={`${product.name} — Estoque atual: ${product.stock}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        {/* Type select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Tipo de Movimentação
          </label>
          <select
            {...register('type')}
            className="flex h-10 w-full rounded-[--radius-md] bg-bg-input border border-border-default px-3 py-2 text-sm text-text-primary transition-colors duration-200 focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </div>

        <Input
          label="Quantidade"
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
        />

        <Input
          label="Motivo"
          placeholder="Ex: Reposição fornecedor, Venda balcão..."
          {...register('reason')}
          error={errors.reason?.message}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit">
            Confirmar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
