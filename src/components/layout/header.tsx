'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SITE_NAME, CATEGORIES } from '@/lib/constants'
import { useMode } from '@/hooks/use-mode'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/contexts/auth-context'
import { SearchOverlay } from './search-overlay'
import { MobileNav } from './mobile-nav'

function slugifyCategory(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function Header() {
  const { mode, toggleMode, hydrated: modeHydrated } = useMode()
  const { items, hydrated: cartHydrated } = useCart()
  const { user } = useAuth()

  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const hydrated = modeHydrated && cartHydrated
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isB2B = mode === 'b2b'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 h-[72px] z-50',
          'bg-bg-primary/80 backdrop-blur-md',
          'border-b border-border-default'
        )}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/images/logo-tm.jpg"
              alt="Tabacaria do Mineiro"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="hidden font-display text-lg font-bold text-accent-green sm:inline">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/catalogo"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Catálogo
            </Link>

            {/* Categories Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={cn(
                  'flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors',
                  categoriesOpen && 'text-text-primary'
                )}
              >
                Categorias
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    categoriesOpen && 'rotate-180'
                  )}
                />
              </button>
              {categoriesOpen && (
                <div
                  className={cn(
                    'absolute top-full left-0 mt-2 w-48',
                    'rounded-[--radius-md] border border-border-default',
                    'bg-bg-elevated shadow-lg'
                  )}
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      href={`/catalogo/${slugifyCategory(cat)}`}
                      className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors first:rounded-t-[--radius-md] last:rounded-b-[--radius-md]"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {hydrated && isB2B && (
              <Link
                href="/pedido-rapido"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Pedido Rápido
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <button
              onClick={toggleMode}
              suppressHydrationWarning
              className={cn(
                'hidden items-center gap-2 rounded-[--radius-pill] border px-3 py-1.5 text-xs font-medium transition-colors md:flex',
                isB2B
                  ? 'border-accent-green bg-accent-green/10 text-accent-green'
                  : 'border-border-default bg-bg-card text-text-secondary hover:border-border-hover'
              )}
            >
              <span
                suppressHydrationWarning
                className={cn(
                  'h-2 w-2 rounded-full',
                  isB2B ? 'bg-accent-green' : 'bg-text-muted'
                )}
              />
              {hydrated ? (isB2B ? 'Atacado' : 'Varejo') : 'Varejo'}
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[--radius-md] text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link
              href="/carrinho"
              className="relative flex h-9 w-9 items-center justify-center rounded-[--radius-md] text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {hydrated && itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-green px-1 text-[10px] font-bold text-bg-primary">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              href={hydrated && user.isAuthenticated ? '/minha-conta' : '/login'}
              className="flex h-9 w-9 items-center justify-center rounded-[--radius-md] text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
              aria-label={hydrated && user.isAuthenticated ? 'Minha Conta' : 'Entrar'}
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[--radius-md] text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  )
}
