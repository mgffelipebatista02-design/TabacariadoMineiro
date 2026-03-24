'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  RefreshCw,
  DollarSign,
  FileText,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const NAV_ITEMS = [
  { href: '/painel-b2b', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/painel-b2b/pedidos', label: 'Pedidos', icon: Package },
  { href: '/painel-b2b/recompra', label: 'Recompra', icon: RefreshCw },
  { href: '/painel-b2b/precos', label: 'Tabela de Preços', icon: DollarSign },
  { href: '/painel-b2b/dados-fiscais', label: 'Dados Fiscais', icon: FileText },
]

export default function PainelB2BLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user.isAuthenticated || user.role !== 'b2b')) {
      router.push('/login')
    }
  }, [user.isAuthenticated, user.role, isLoading, router])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mt-12 px-4 pb-16">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="flex gap-8">
          <Skeleton className="h-64 w-56 hidden md:block" />
          <Skeleton className="h-96 flex-1" />
        </div>
      </div>
    )
  }

  if (!user.isAuthenticated || user.role !== 'b2b') {
    return null
  }

  const activeItem = NAV_ITEMS.find((item) =>
    item.href === '/painel-b2b'
      ? pathname === '/painel-b2b'
      : pathname.startsWith(item.href)
  )

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 pb-16">
      <h1 className="font-display text-2xl text-text-primary mb-8">
        Painel B2B
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile dropdown */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-between w-full bg-bg-card border border-border-default rounded-[--radius-md] px-4 py-3 text-sm font-medium text-text-primary"
          >
            <span className="flex items-center gap-2">
              {activeItem && <activeItem.icon className="h-4 w-4" />}
              {activeItem?.label || 'Menu'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                mobileOpen && 'rotate-180'
              )}
            />
          </button>
          {mobileOpen && (
            <nav className="mt-2 bg-bg-card border border-border-default rounded-[--radius-md] overflow-hidden">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/painel-b2b'
                    ? pathname === '/painel-b2b'
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-accent-amber bg-accent-amber/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        {/* Desktop sidebar */}
        <nav className="hidden md:flex flex-col w-56 shrink-0 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/painel-b2b'
                ? pathname === '/painel-b2b'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-[--radius-md] text-sm font-medium transition-colors',
                  isActive
                    ? 'text-accent-amber bg-accent-amber/10 border border-accent-amber/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
