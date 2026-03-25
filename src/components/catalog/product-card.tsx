'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { useMode } from '@/hooks/use-mode'
import { useCart } from '@/hooks/use-cart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/ui/price-display'

function stockBadge(stock: number) {
  if (stock > 10)
    return <Badge variant="green">Em estoque</Badge>
  if (stock >= 1)
    return <Badge variant="olive">Últimas unidades</Badge>
  return <Badge variant="red">Indisponível</Badge>
}

export interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { mode } = useMode()
  const { addItem } = useCart()

  const isB2B = mode === 'b2b'
  const price = isB2B ? product.priceB2B : product.priceB2C
  const unit = isB2B ? product.unitB2B : product.unitB2C
  const outOfStock = product.stock === 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    addItem({
      productId: product.id,
      quantity: isB2B ? product.minQtyB2B : 1,
      name: product.name,
      price,
      image: product.images[0] ?? '',
      unit,
    })
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/produto/${product.slug}`} className="block h-full">
        <div className="group flex h-full flex-col overflow-hidden rounded-[--radius-xl] border border-border-default bg-bg-card transition-colors duration-200 hover:border-accent-green">
          {/* Image */}
          <div className="relative aspect-square bg-bg-elevated">
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-12 w-12 text-text-muted" />
            </div>
            <div className="absolute right-2 top-2">
              {stockBadge(product.stock)}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-1.5 p-3">
            <span className="text-xs text-text-muted font-body">
              {product.brand}
            </span>
            <h3 className="line-clamp-2 text-sm font-medium text-text-primary font-body leading-snug">
              {product.name}
            </h3>
            <div className="mt-auto pt-2">
              <PriceDisplay
                priceB2C={product.priceB2C}
                priceB2B={product.priceB2B}
                size="sm"
              />
            </div>
            <Button
              size="sm"
              fullWidth
              disabled={outOfStock}
              onClick={handleAdd}
              className="mt-2"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export { ProductCard }
