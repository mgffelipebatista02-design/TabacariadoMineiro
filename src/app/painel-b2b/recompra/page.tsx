'use client'

import { useMemo, useState } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { orders } from '@/data/orders'
import { products } from '@/data/products'
import { useCart } from '@/hooks/use-cart'
import { formatBRL } from '@/lib/utils'
import type { CartItem } from '@/types'

const B2B_CUSTOMER_IDS = ['cust-013', 'cust-015', 'cust-017', 'cust-019']

export default function RecompraPage() {
  const { addItem } = useCart()
  const [addedOrderId, setAddedOrderId] = useState<string | null>(null)

  const b2bOrders = useMemo(
    () =>
      orders
        .filter((o) => B2B_CUSTOMER_IDS.includes(o.customerId))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    []
  )

  function handleRepeatOrder(orderId: string) {
    const order = b2bOrders.find((o) => o.id === orderId)
    if (!order) return

    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId)
      const cartItem: CartItem = {
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: product?.images[0] || '/images/products/placeholder.jpg',
        unit: item.unit,
      }
      addItem(cartItem)
    }

    setAddedOrderId(orderId)
    setTimeout(() => setAddedOrderId(null), 3000)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-text-primary">Recompra</h2>
      <p className="text-sm text-text-muted">
        Selecione um pedido anterior para adicionar todos os itens ao carrinho.
      </p>

      <div className="space-y-4">
        {b2bOrders.map((order) => (
          <Card key={order.id} padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-text-primary font-medium">
                    {order.orderNumber}
                  </span>
                  <Badge variant="gray">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>

                <ul className="space-y-1">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-text-secondary"
                    >
                      {item.quantity}x {item.name} -{' '}
                      {formatBRL(item.price)} / {item.unit}
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-medium text-text-primary mt-2">
                  Total: {formatBRL(order.total)}
                </p>
              </div>

              <Button
                variant={addedOrderId === order.id ? 'secondary' : 'primary'}
                size="md"
                onClick={() => handleRepeatOrder(order.id)}
                disabled={addedOrderId === order.id}
              >
                {addedOrderId === order.id ? (
                  <>
                    <Check className="h-4 w-4" />
                    Adicionado
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Repetir Pedido
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}

        {b2bOrders.length === 0 && (
          <Card padding="lg">
            <p className="text-center text-text-muted py-4">
              Nenhum pedido anterior encontrado.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
