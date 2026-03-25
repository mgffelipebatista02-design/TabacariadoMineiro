'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, KeyRound, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const NAV_ITEMS = [
  { href: '/minha-conta/dados', label: 'Meus Dados', icon: User },
  { href: '/minha-conta/pedidos', label: 'Meus Pedidos', icon: Package },
  { href: '/minha-conta/enderecos', label: 'Endereços', icon: MapPin },
  { href: '/minha-conta/senha', label: 'Alterar Senha', icon: KeyRound },
]

export default function MinhaContaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user.isAuthenticated) {
      router.push('/login')
    }
  }, [user.isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-12 px-4 pb-16">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="flex gap-8">
          <Skeleton className="h-48 w-56 hidden md:block" />
          <Skeleton className="h-64 flex-1" />
        </div>
      </div>
    )
  }

  if (!user.isAuthenticated) {
    return null
  }

  const activeItem = NAV_ITEMS.find((item) => pathname === item.href)

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 pb-16">
      <h1 className="font-display text-2xl text-text-primary mb-8">
        Minha Conta
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
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-accent-green bg-accent-green/10'
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
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-[--radius-md] text-sm font-medium transition-colors',
                  isActive
                    ? 'text-accent-green bg-accent-green/10 border border-accent-green/25'
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
