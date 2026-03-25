'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Package, DollarSign, TrendingUp, Clock, Zap, Table2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { orders } from '@/data/orders'
import { formatBRL } from '@/lib/utils'

const STATUS_BADGE_MAP: Record<string, { label: string; variant: 'olive' | 'green' | 'red' | 'blue' | 'gray' }> = {
  pendente: { label: 'Pendente', variant: 'gray' },
  confirmado: { label: 'Confirmado', variant: 'blue' },
  em_separacao: { label: 'Em Separacao', variant: 'olive' },
  enviado: { label: 'Enviado', variant: 'blue' },
  em_transito: { label: 'Em Transito', variant: 'olive' },
  entregue: { label: 'Entregue', variant: 'green' },
  cancelado: { label: 'Cancelado', variant: 'red' },
}

// B2B orders are those with paymentCondition (installment terms) or high quantities
const B2B_CUSTOMER_IDS = ['cust-013', 'cust-015', 'cust-017', 'cust-019']

export default function PainelB2BDashboard() {
  const b2bOrders = useMemo(
    () => orders.filter((o) => B2B_CUSTOMER_IDS.includes(o.customerId)),
    []
  )

  const totalOrders = b2bOrders.length
  const totalValue = b2bOrders.reduce((sum, o) => sum + o.total, 0)
  const averageTicket = totalOrders > 0 ? totalValue / totalOrders : 0
  const lastOrder = b2bOrders.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0]

  const recentOrders = b2bOrders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const metrics = [
    {
      label: 'Total de Pedidos',
      value: totalOrders.toString(),
      icon: Package,
    },
    {
      label: 'Valor Total',
      value: formatBRL(totalValue),
      icon: DollarSign,
    },
    {
      label: 'Ticket Medio',
      value: formatBRL(averageTicket),
      icon: TrendingUp,
    },
    {
      label: 'Ultimo Pedido',
      value: lastOrder
        ? new Date(lastOrder.date).toLocaleDateString('pt-BR')
        : '-',
      icon: Clock,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted font-body">
                  {metric.label}
                </p>
                <p className="text-xl font-display text-text-primary mt-1">
                  {metric.value}
                </p>
              </div>
              <div className="p-2 bg-accent-green/10 rounded-[--radius-md]">
                <metric.icon className="h-5 w-5 text-accent-green" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/pedido-rapido">
          <Button variant="primary" size="md">
            <Zap className="h-4 w-4" />
            Novo Pedido Rapido
          </Button>
        </Link>
        <Link href="/painel-b2b/precos">
          <Button variant="secondary" size="md">
            <Table2 className="h-4 w-4" />
            Ver Tabela de Precos
          </Button>
        </Link>
      </div>

      {/* Recent orders */}
      <Card padding="none">
        <div className="px-4 py-3 border-b border-border-default">
          <h2 className="font-display text-lg text-text-primary">
            Pedidos Recentes
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => {
              const statusInfo = STATUS_BADGE_MAP[order.status] || {
                label: order.status,
                variant: 'gray' as const,
              }
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatBRL(order.total)}
                  </TableCell>
                </TableRow>
              )
            })}
            {recentOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-text-muted py-8">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
