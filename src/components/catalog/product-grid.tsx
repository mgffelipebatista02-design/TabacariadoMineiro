'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { PackageOpen } from 'lucide-react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/catalog/product-card'

export interface ProductGridProps {
  products: Product[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <PackageOpen className="h-12 w-12 text-text-muted" />
        <p className="text-lg font-medium text-text-secondary font-body">
          Nenhum produto encontrado
        </p>
        <p className="text-sm text-text-muted font-body">
          Tente ajustar os filtros ou explorar outras categorias.
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={products.map((p) => p.id).join(',')}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export { ProductGrid }
