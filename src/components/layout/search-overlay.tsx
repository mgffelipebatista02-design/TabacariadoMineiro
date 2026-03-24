'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { X, Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatBRL } from '@/lib/utils'
import { products } from '@/data/products'
import { useMode } from '@/hooks/use-mode'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { mode } = useMode()

  const filteredProducts = query.trim().length > 0
    ? products.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
        )
      })
    : []

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      // Auto-focus after animation starts
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        clearTimeout(timer)
      }
    }
  }, [isOpen, handleKeyDown])

  // Reset query when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-lg"
        >
          <div className="mx-auto flex h-full max-w-[800px] flex-col px-4 pt-6">
            {/* Top bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar produtos, marcas, categorias..."
                  className={cn(
                    'w-full rounded-[--radius-lg] border border-border-default bg-bg-input',
                    'py-4 pl-12 pr-4 text-lg text-text-primary placeholder:text-text-muted',
                    'outline-none focus:border-accent-amber transition-colors'
                  )}
                />
              </div>
              <button
                onClick={onClose}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[--radius-md] text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
                aria-label="Fechar busca"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Results */}
            <div className="mt-6 flex-1 overflow-y-auto pb-6">
              {query.trim().length > 0 && filteredProducts.length === 0 && (
                <p className="text-center text-text-muted py-12">
                  Nenhum produto encontrado para &quot;{query}&quot;
                </p>
              )}

              {filteredProducts.length > 0 && (
                <div className="space-y-2">
                  <p className="mb-4 text-sm text-text-muted">
                    {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/produto/${product.slug}`}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-4 rounded-[--radius-md] border border-border-default p-3',
                        'bg-bg-card hover:border-border-hover hover:bg-bg-elevated transition-colors'
                      )}
                    >
                      {/* Image placeholder */}
                      <div className="h-14 w-14 flex-shrink-0 rounded-[--radius-sm] bg-bg-elevated flex items-center justify-center">
                        <span className="text-lg text-text-muted">📦</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {product.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {product.brand} &middot; {product.category}
                        </p>
                      </div>

                      <p className="flex-shrink-0 text-sm font-semibold text-accent-amber">
                        {formatBRL(mode === 'b2b' ? product.priceB2B : product.priceB2C)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {query.trim().length === 0 && (
                <p className="text-center text-text-muted py-12">
                  Digite para buscar produtos...
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
