'use client'

import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { orders } from '@/data/orders'
import { formatBRL } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'olive' | 'green' | 'red' | 'blue' | 'gray' }
> = {
  pendente: { label: 'Pendente', variant: 'olive' },
  confirmado: { label: 'Confirmado', variant: 'blue' },
  em_separacao: { label: 'Em Separação', variant: 'blue' },
  enviado: { label: 'Enviado', variant: 'blue' },
  em_transito: { label: 'Em Trânsito', variant: 'blue' },
  entregue: { label: 'Entregue', variant: 'green' },
  cancelado: { label: 'Cancelado', variant: 'red' },
}

export default function PedidosPage() {
  return (
    <div>
      <h2 className="font-display text-xl text-text-primary mb-4">
        Meus Pedidos
      </h2>

      {orders.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Package className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm">
            Você ainda não realizou nenhum pedido.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status]
            const date = new Date(order.date).toLocaleDateString('pt-BR')
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            )

            return (
              <Link
                key={order.id}
                href={`/rastreio/${order.orderNumber}`}
              >
                <Card
                  padding="md"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-text-primary">
                        {order.orderNumber}
                      </span>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted">
                      {date} &middot; {itemCount}{' '}
                      {itemCount === 1 ? 'item' : 'itens'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-body font-semibold text-text-primary">
                      {formatBRL(order.total)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-text-muted" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
