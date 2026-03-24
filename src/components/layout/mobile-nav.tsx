'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import { useMode } from '@/hooks/use-mode'
import { useAuth } from '@/contexts/auth-context'

function slugifyCategory(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { mode, toggleMode } = useMode()
  const { user } = useAuth()

  const isB2B = mode === 'b2b'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed left-0 top-0 bottom-0 z-50 w-[280px]',
              'bg-bg-primary border-r border-border-default',
              'flex flex-col overflow-y-auto'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-default px-4 py-4">
              <span className="font-display text-lg font-bold text-accent-amber">
                Menu
              </span>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-[--radius-md] text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-4">
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={onClose}
                  className="block rounded-[--radius-md] px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-card transition-colors"
                >
                  Home
                </Link>

                <Link
                  href="/catalogo"
                  onClick={onClose}
                  className="block rounded-[--radius-md] px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-card transition-colors"
                >
                  Catálogo
                </Link>

                {/* Category Sub-links */}
                <div className="pl-3">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/catalogo/${slugifyCategory(cat)}`}
                      onClick={onClose}
                      className="block rounded-[--radius-md] px-3 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>

                {isB2B && (
                  <Link
                    href="/pedido-rapido"
                    onClick={onClose}
                    className="block rounded-[--radius-md] px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-card transition-colors"
                  >
                    Pedido Rápido
                  </Link>
                )}

                <Link
                  href={user.isAuthenticated ? '/minha-conta' : '/login'}
                  onClick={onClose}
                  className="block rounded-[--radius-md] px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-card transition-colors"
                >
                  {user.isAuthenticated ? 'Minha Conta' : 'Login'}
                </Link>
              </div>
            </nav>

            {/* Mode Toggle */}
            <div className="border-t border-border-default px-4 py-4">
              <button
                onClick={toggleMode}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-[--radius-md] border px-4 py-2.5 text-sm font-medium transition-colors',
                  isB2B
                    ? 'border-accent-amber bg-accent-amber/10 text-accent-amber'
                    : 'border-border-default bg-bg-card text-text-secondary hover:border-border-hover'
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    isB2B ? 'bg-accent-amber' : 'bg-text-muted'
                  )}
                />
                {isB2B ? 'Modo Atacado' : 'Modo Varejo'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
