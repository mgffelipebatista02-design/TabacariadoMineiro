'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, MapPin, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { orders } from '@/data/orders'
import { formatBRL } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: 'amber' | 'green' | 'red' | 'blue' | 'gray' }
> = {
  pendente: { label: 'Pendente', variant: 'amber' },
  confirmado: { label: 'Confirmado', variant: 'blue' },
  em_separacao: { label: 'Em Separação', variant: 'blue' },
  enviado: { label: 'Enviado', variant: 'blue' },
  em_transito: { label: 'Em Trânsito', variant: 'blue' },
  entregue: { label: 'Entregue', variant: 'green' },
  cancelado: { label: 'Cancelado', variant: 'red' },
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  em_separacao: 'Em Separação',
  enviado: 'Enviado',
  em_transito: 'Em Trânsito',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export default function RastreioPage() {
  const params = useParams()
  const numeroPedido = params.numeroPedido as string

  const order = orders.find((o) => o.orderNumber === numeroPedido)

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto mt-24 px-4 pb-16 text-center">
        <Card padding="lg">
          <AlertCircle className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h1 className="font-display text-xl text-text-primary mb-2">
            Pedido não encontrado
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Não encontramos nenhum pedido com o número{' '}
            <span className="font-mono font-semibold">{numeroPedido}</span>.
          </p>
          <Link href="/minha-conta/pedidos">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Voltar aos Pedidos
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[order.status]
  const date = new Date(order.date).toLocaleDateString('pt-BR')
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 pb-16">
      <Link
        href="/minha-conta/pedidos"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos Pedidos
      </Link>

      {/* Order header */}
      <Card padding="lg" className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="font-display text-xl text-text-primary">
              Pedido {order.orderNumber}
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Realizado em {date} &middot; {itemCount}{' '}
              {itemCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-default">
          <div>
            <p className="text-xs text-text-muted">Subtotal</p>
            <p className="text-sm font-semibold text-text-primary">
              {formatBRL(order.subtotal)}
            </p>
          </div>
          {order.discount > 0 && (
            <div>
              <p className="text-xs text-text-muted">Desconto</p>
              <p className="text-sm font-semibold text-status-success">
                -{formatBRL(order.discount)}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-text-muted">Frete</p>
            <p className="text-sm font-semibold text-text-primary">
              {order.shipping === 0 ? 'Grátis' : formatBRL(order.shipping)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Total</p>
            <p className="text-sm font-semibold text-accent-amber">
              {formatBRL(order.total)}
            </p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card padding="lg" className="mb-4">
        <h2 className="font-display text-base text-text-primary mb-6">
          Rastreamento
        </h2>

        <div className="flex flex-col">
          {order.timeline.map((event, index) => {
            const isLast = index === order.timeline.length - 1
            const isFirst = index === 0
            const eventDate = new Date(event.date)
            const formattedDate = eventDate.toLocaleDateString('pt-BR')
            const formattedTime = eventDate.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div key={index} className="flex gap-4">
                {/* Timeline line and dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'h-3 w-3 rounded-full shrink-0 mt-1',
                      isLast
                        ? 'bg-accent-amber ring-4 ring-accent-amber/20'
                        : 'bg-border-default'
                    )}
                  />
                  {!isFirst && <div className="w-0.5 flex-1" />}
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-border-default" />
                  )}
                </div>

                {/* Event content */}
                <div className={cn('pb-6', isLast && 'pb-0')}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isLast ? 'text-accent-amber' : 'text-text-primary'
                      )}
                    >
                      {STATUS_LABELS[event.status]}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-muted">
                      {formattedDate} às {formattedTime}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Shipping details */}
      {order.trackingCode && (
        <Card padding="lg" className="mb-4">
          <h2 className="font-display text-base text-text-primary mb-4">
            Dados de Envio
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-text-muted shrink-0" />
              <div>
                <p className="text-xs text-text-muted">Código de rastreio</p>
                <p className="text-sm font-mono font-semibold text-text-primary">
                  {order.trackingCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-text-muted shrink-0" />
              <div>
                <p className="text-xs text-text-muted">Pagamento</p>
                <p className="text-sm text-text-primary">
                  {order.paymentMethod}
                  {order.paymentCondition && ` (${order.paymentCondition})`}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Shipping address */}
      <Card padding="lg">
        <h2 className="font-display text-base text-text-primary mb-4">
          Endereço de Entrega
        </h2>
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-text-muted shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {order.shippingAddress.label}
            </p>
            <p className="text-sm text-text-secondary">
              {order.shippingAddress.street}, {order.shippingAddress.number}
              {order.shippingAddress.complement &&
                ` - ${order.shippingAddress.complement}`}
            </p>
            <p className="text-sm text-text-secondary">
              {order.shippingAddress.neighborhood} -{' '}
              {order.shippingAddress.city}/{order.shippingAddress.state}
            </p>
            <p className="text-xs text-text-muted mt-1">
              CEP: {order.shippingAddress.cep}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
