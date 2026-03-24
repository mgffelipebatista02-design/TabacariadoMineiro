'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Package, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { orders } from '@/data/orders'
import type { Order } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const MOCK_LOCATIONS = ['A-01-03', 'A-02-05', 'B-01-02', 'B-02-05', 'C-01-01', 'C-03-04', 'D-01-06', 'D-02-02']

function getLocation(index: number) {
  return MOCK_LOCATIONS[index % MOCK_LOCATIONS.length]
}

interface PickingOrder extends Order {
  pickedItems: Set<number>
  sent: boolean
}

export default function PickingPage() {
  const initialOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === 'em_separacao')
      .map((o) => ({
        ...o,
        pickedItems: new Set<number>(),
        sent: false,
      }))
  }, [])

  const [pickingOrders, setPickingOrders] = useState<PickingOrder[]>(initialOrders)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    initialOrders.length > 0 ? initialOrders[0].id : null
  )

  function toggleExpand(orderId: string) {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId))
  }

  function togglePick(orderId: string, itemIndex: number) {
    setPickingOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const newPicked = new Set(o.pickedItems)
        if (newPicked.has(itemIndex)) {
          newPicked.delete(itemIndex)
        } else {
          newPicked.add(itemIndex)
        }
        return { ...o, pickedItems: newPicked }
      })
    )
  }

  function markAsSent(orderId: string) {
    setPickingOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, sent: true } : o
      )
    )
  }

  const activeOrders = pickingOrders.filter((o) => !o.sent)
  const sentOrders = pickingOrders.filter((o) => o.sent)

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text-primary">
        Picking / Separação
      </h2>

      {activeOrders.length === 0 && sentOrders.length === 0 && (
        <Card padding="lg">
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Package className="h-12 w-12 mb-3" />
            <p className="text-base font-medium">Nenhum pedido em separação</p>
            <p className="text-sm mt-1">Todos os pedidos foram processados.</p>
          </div>
        </Card>
      )}

      {/* Active orders */}
      <div className="space-y-4">
        {activeOrders.map((order) => {
          const isExpanded = expandedOrder === order.id
          const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0)
          const pickedCount = order.pickedItems.size
          const allPicked = pickedCount === order.items.length
          const progressPercent = order.items.length > 0 ? (pickedCount / order.items.length) * 100 : 0

          return (
            <Card key={order.id} padding="none">
              {/* Header */}
              <button
                onClick={() => toggleExpand(order.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-sm font-semibold text-text-primary">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(order.date).toLocaleDateString('pt-BR')} — {order.items.length} itens ({totalItems} un.)
                    </p>
                  </div>
                  <Badge variant="amber">Em Separação</Badge>
                </div>
                <div className="flex items-center gap-4">
                  {/* Mini progress */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-bg-elevated overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent-amber transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted font-mono">
                      {pickedCount}/{order.items.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-muted" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border-default px-4 pb-4">
                  {/* Progress bar */}
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-secondary">Progresso da separação</span>
                      <span className="text-xs font-mono text-text-muted">
                        {pickedCount} de {order.items.length} itens separados
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-bg-elevated overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          allPicked ? 'bg-status-success' : 'bg-accent-amber'
                        )}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => {
                      const isPicked = order.pickedItems.has(idx)
                      return (
                        <label
                          key={idx}
                          className={cn(
                            'flex items-center gap-3 rounded-[--radius-md] p-3 cursor-pointer transition-colors',
                            isPicked ? 'bg-status-success/5' : 'bg-bg-elevated hover:bg-bg-elevated/80'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isPicked}
                            onChange={() => togglePick(order.id, idx)}
                            className="h-5 w-5 rounded border-border-default text-accent-amber focus:ring-accent-amber accent-amber-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-sm font-medium', isPicked ? 'line-through text-text-muted' : 'text-text-primary')}>
                              {item.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              SKU: {item.productId}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-mono text-text-primary">
                              {item.quantity}x
                            </p>
                            <p className="text-xs font-mono text-text-muted">
                              {getLocation(idx)}
                            </p>
                          </div>
                          {isPicked && <CheckCircle2 className="h-5 w-5 text-status-success shrink-0" />}
                        </label>
                      )
                    })}
                  </div>

                  {/* Action button */}
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => markAsSent(order.id)}
                      disabled={!allPicked}
                      variant="primary"
                      size="md"
                    >
                      <Truck className="h-4 w-4" />
                      Marcar como Enviado
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Sent orders */}
      {sentOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-text-secondary">Enviados</h3>
          {sentOrders.map((order) => (
            <Card key={order.id} padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-text-primary">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-text-muted">
                    {order.items.length} itens
                  </p>
                </div>
                <Badge variant="green">Enviado</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
