'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Package } from 'lucide-react'
import { cn, formatBRL } from '@/lib/utils'
import { products } from '@/data/products'
import type { Product, Category } from '@/types'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

type SortKey = 'name' | 'category' | 'priceB2C' | 'priceB2B' | 'stock'
type SortDir = 'asc' | 'desc'

const categories: (Category | 'Todas')[] = ['Todas', 'Essências', 'Sedas', 'Isqueiros', 'Narguilé', 'Acessórios', 'Tabaco']

function getStockStatus(stock: number) {
  if (stock === 0) return { label: 'Esgotado', variant: 'red' as const }
  if (stock <= 20) return { label: 'Baixo', variant: 'amber' as const }
  return { label: 'Normal', variant: 'green' as const }
}

export default function InventarioPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'Todas'>('Todas')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [editingCell, setEditingCell] = useState<{ id: string; field: 'priceB2C' | 'priceB2B' | 'stock' } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [localProducts, setLocalProducts] = useState<Product[]>(products)

  const filtered = useMemo(() => {
    let result = [...localProducts]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== 'Todas') {
      result = result.filter((p) => p.category === categoryFilter)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category)
      else cmp = (a[sortKey] as number) - (b[sortKey] as number)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [localProducts, search, categoryFilter, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function startEdit(id: string, field: 'priceB2C' | 'priceB2B' | 'stock', currentValue: number) {
    setEditingCell({ id, field })
    setEditValue(String(currentValue))
  }

  function commitEdit() {
    if (!editingCell) return
    const numValue = parseFloat(editValue)
    if (isNaN(numValue) || numValue < 0) {
      setEditingCell(null)
      return
    }
    setLocalProducts((prev) =>
      prev.map((p) =>
        p.id === editingCell.id
          ? { ...p, [editingCell.field]: editingCell.field === 'stock' ? Math.round(numValue) : numValue }
          : p
      )
    )
    setEditingCell(null)
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 opacity-40" />
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text-primary">Inventário</h2>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome, SKU ou marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Categoria</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | 'Todas')}
              className="h-10 rounded-[--radius-md] bg-bg-input border border-border-default px-3 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagem</TableHead>
              <TableHead>
                <button onClick={() => handleSort('name')} className="flex items-center gap-1">
                  Nome <SortIcon column="name" />
                </button>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>
                <button onClick={() => handleSort('category')} className="flex items-center gap-1">
                  Categoria <SortIcon column="category" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort('priceB2C')} className="flex items-center gap-1">
                  Preço B2C <SortIcon column="priceB2C" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort('priceB2B')} className="flex items-center gap-1">
                  Preço B2B <SortIcon column="priceB2B" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort('stock')} className="flex items-center gap-1">
                  Estoque <SortIcon column="stock" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => {
              const status = getStockStatus(product.stock)
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[--radius-md] bg-bg-elevated">
                      <Package className="h-5 w-5 text-text-muted" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{product.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-text-secondary">{product.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-text-secondary">{product.category}</span>
                  </TableCell>

                  {/* Editable price B2C */}
                  <TableCell>
                    {editingCell?.id === product.id && editingCell.field === 'priceB2C' ? (
                      <input
                        autoFocus
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit()
                          if (e.key === 'Escape') setEditingCell(null)
                        }}
                        className="w-24 rounded-[--radius-md] bg-bg-input border border-accent-amber px-2 py-1 text-sm font-mono text-text-primary focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(product.id, 'priceB2C', product.priceB2C)}
                        className="font-mono text-sm hover:text-accent-amber transition-colors cursor-pointer"
                      >
                        {formatBRL(product.priceB2C)}
                      </button>
                    )}
                  </TableCell>

                  {/* Editable price B2B */}
                  <TableCell>
                    {editingCell?.id === product.id && editingCell.field === 'priceB2B' ? (
                      <input
                        autoFocus
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit()
                          if (e.key === 'Escape') setEditingCell(null)
                        }}
                        className="w-24 rounded-[--radius-md] bg-bg-input border border-accent-amber px-2 py-1 text-sm font-mono text-text-primary focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(product.id, 'priceB2B', product.priceB2B)}
                        className="font-mono text-sm hover:text-accent-amber transition-colors cursor-pointer"
                      >
                        {formatBRL(product.priceB2B)}
                      </button>
                    )}
                  </TableCell>

                  {/* Editable stock */}
                  <TableCell>
                    {editingCell?.id === product.id && editingCell.field === 'stock' ? (
                      <input
                        autoFocus
                        type="number"
                        step="1"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit()
                          if (e.key === 'Escape') setEditingCell(null)
                        }}
                        className="w-20 rounded-[--radius-md] bg-bg-input border border-accent-amber px-2 py-1 text-sm font-mono text-text-primary focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(product.id, 'stock', product.stock)}
                        className="font-mono text-sm hover:text-accent-amber transition-colors cursor-pointer"
                      >
                        {product.stock}
                      </button>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Package className="h-10 w-10 mb-2" />
            <p className="text-sm">Nenhum produto encontrado.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
