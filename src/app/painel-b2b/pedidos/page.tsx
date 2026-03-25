'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
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

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em_separacao', label: 'Em Separacao' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'em_transito', label: 'Em Transito' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
]

const B2B_CUSTOMER_IDS = ['cust-013', 'cust-015', 'cust-017', 'cust-019']

export default function PedidosB2BPage() {
  const [statusFilter, setStatusFilter] = useState('')

  const b2bOrders = useMemo(() => {
    let filtered = orders.filter((o) => B2B_CUSTOMER_IDS.includes(o.customerId))
    if (statusFilter) {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text-primary">Pedidos</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-[--radius-md] bg-bg-input border border-border-default px-3 py-2 text-sm text-text-primary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N. Pedido</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Cond. Pgto</TableHead>
              <TableHead>NF-e</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {b2bOrders.map((order) => {
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
                  <TableCell className="text-sm">
                    {order.paymentCondition || order.paymentMethod}
                  </TableCell>
                  <TableCell>
                    {order.nfe ? (
                      <span className="font-mono text-xs text-text-secondary">
                        {order.nfe.slice(-8)}
                      </span>
                    ) : (
                      <Badge variant="gray">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatBRL(order.total)}
                  </TableCell>
                </TableRow>
              )
            })}
            {b2bOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-text-muted py-8"
                >
                  Nenhum pedido encontrado com o filtro selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
