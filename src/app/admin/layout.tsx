'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  Package,
  ClipboardList,
  Tag,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { Skeleton } from '@/components/ui/skeleton'

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/inventario', label: 'Inventário', icon: Package },
  { href: '/admin/picking', label: 'Picking', icon: ClipboardList },
  { href: '/admin/etiquetas', label: 'Etiquetas', icon: Tag },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user.isAuthenticated || user.role !== 'admin')) {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <Skeleton width={48} height={48} rounded="full" />
      </div>
    )
  }

  if (!user.isAuthenticated || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-border-default bg-bg-secondary transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-border-default px-4">
          {!collapsed && (
            <span className="font-display text-sm font-semibold text-accent-amber truncate">
              TBM Admin
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-[--radius-md] text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 p-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-[--radius-md] px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent-amber/10 text-accent-amber border-l-2 border-accent-amber'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout button */}
        <div className="border-t border-border-default p-2">
          <button
            onClick={() => {
              logout()
              router.replace('/login')
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-[--radius-md] px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors'
            )}
            title={collapsed ? 'Sair' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <header className="flex h-16 items-center justify-between border-b border-border-default bg-bg-secondary px-6">
          <h1 className="font-display text-lg font-semibold text-text-primary">
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">
              {user.customer?.name ?? 'Admin'}
            </span>
            <div className="h-8 w-8 rounded-full bg-accent-amber/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-accent-amber">
                {(user.customer?.name ?? 'A').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
