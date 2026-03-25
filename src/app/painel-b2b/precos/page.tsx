'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
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
import { products } from '@/data/products'
import { CATEGORIES } from '@/lib/constants'
import { formatBRL } from '@/lib/utils'

export default function TabelaPrecosPage() {
  const [search, setSearch] = useState('')

  const filteredByCategory = useMemo(() => {
    const term = search.toLowerCase().trim()
    const filtered = term
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        )
      : products

    const grouped: Record<string, typeof products> = {}
    for (const cat of CATEGORIES) {
      const items = filtered.filter((p) => p.category === cat)
      if (items.length > 0) {
        grouped[cat] = items
      }
    }
    return grouped
  }, [search])

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-text-primary">
        Tabela de Precos
      </h2>

      <Input
        placeholder="Buscar por nome, marca ou categoria..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      {Object.entries(filteredByCategory).map(([category, items]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display text-lg text-text-primary">
              {category}
            </h3>
            <Badge variant="olive">{items.length}</Badge>
          </div>
          <Card padding="none" className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preco Unit. (B2B)</TableHead>
                  <TableHead className="text-right">Un. Minima</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text-primary">
                          {product.name}
                        </p>
                        <p className="text-xs text-text-muted">{product.brand}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary text-sm">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatBRL(product.priceB2B)}
                      <span className="text-xs text-text-muted ml-1">
                        / {product.unitB2B}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {product.minQtyB2B}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.stock > 20 ? (
                        <Badge variant="green">{product.stock}</Badge>
                      ) : product.stock > 0 ? (
                        <Badge variant="olive">{product.stock}</Badge>
                      ) : (
                        <Badge variant="red">Indisponivel</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      ))}

      {Object.keys(filteredByCategory).length === 0 && (
        <Card padding="lg">
          <p className="text-center text-text-muted py-4">
            Nenhum produto encontrado para a busca realizada.
          </p>
        </Card>
      )}
    </div>
  )
}
