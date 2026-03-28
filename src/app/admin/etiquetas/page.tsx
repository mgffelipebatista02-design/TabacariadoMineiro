'use client'

import { useState, useMemo } from 'react'
import { Printer, Package, CheckSquare, Square } from 'lucide-react'
import { cn, formatBRL } from '@/lib/utils'
import { orders } from '@/data/orders'
import type { Order } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

function generateTrackingCode(orderId: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'BR'
  // Derive a deterministic code from the orderId to avoid hydration mismatch
  for (let i = 0; i < 9; i++) {
    const charCode = orderId.charCodeAt(i % orderId.length) + i
    code += chars[charCode % chars.length]
  }
  code += 'CD'
  return code
}

export default function EtiquetasPage() {
  const eligibleOrders = useMemo(
    () => orders.filter((o) => o.status === 'enviado' || o.status === 'em_separacao'),
    []
  )

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [peso, setPeso] = useState('0.5')
  const [comprimento, setComprimento] = useState('30')
  const [largura, setLargura] = useState('20')
  const [altura, setAltura] = useState('15')

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    if (selectedIds.size === eligibleOrders.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(eligibleOrders.map((o) => o.id)))
    }
  }

  function handleGerarPDF() {
    alert('PDF gerado com sucesso')
  }

  const selectedOrders = eligibleOrders.filter((o) => selectedIds.has(o.id))
  const allSelected = selectedIds.size === eligibleOrders.length && eligibleOrders.length > 0

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text-primary">
        Etiquetas de Envio
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Order list */}
        <div className="space-y-4">
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Pedidos Disponíveis
              </h3>
              <button
                onClick={selectAll}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-green transition-colors"
              >
                {allSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
              </button>
            </div>

            {eligibleOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                <Package className="h-10 w-10 mb-2" />
                <p className="text-sm">Nenhum pedido disponível para etiqueta.</p>
              </div>
            )}

            <div className="space-y-2">
              {eligibleOrders.map((order) => {
                const isSelected = selectedIds.has(order.id)
                return (
                  <label
                    key={order.id}
                    className={cn(
                      'flex items-center gap-3 rounded-[--radius-md] p-3 cursor-pointer transition-colors border',
                      isSelected
                        ? 'border-accent-green bg-accent-green/5'
                        : 'border-border-default bg-bg-elevated hover:border-border-hover'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(order.id)}
                      className="h-4 w-4 rounded border-border-default text-accent-green focus:ring-accent-green"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-text-primary">
                          {order.orderNumber}
                        </span>
                        <Badge variant={order.status === 'enviado' ? 'green' : 'olive'}>
                          {order.status === 'enviado' ? 'Enviado' : 'Em Separação'}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {order.shippingAddress.city}, {order.shippingAddress.state} — {order.items.length} itens — {formatBRL(order.total)}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </Card>

          {/* Dimensions form */}
          <Card padding="md">
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">
              Dados da Embalagem
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Peso (kg)"
                type="number"
                step="0.1"
                min="0"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
              <Input
                label="Comprimento (cm)"
                type="number"
                min="0"
                value={comprimento}
                onChange={(e) => setComprimento(e.target.value)}
              />
              <Input
                label="Largura (cm)"
                type="number"
                min="0"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
              />
              <Input
                label="Altura (cm)"
                type="number"
                min="0"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <Button
                onClick={handleGerarPDF}
                disabled={selectedOrders.length === 0}
                fullWidth
                variant="primary"
              >
                <Printer className="h-4 w-4" />
                Gerar PDF ({selectedOrders.length} etiqueta{selectedOrders.length !== 1 ? 's' : ''})
              </Button>
            </div>
          </Card>
        </div>

        {/* Label preview */}
        <div className="space-y-4">
          <h3 className="font-display text-base font-semibold text-text-primary">
            Pré-visualização
          </h3>

          {selectedOrders.length === 0 && (
            <Card padding="lg">
              <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                <Printer className="h-10 w-10 mb-2" />
                <p className="text-sm">Selecione pedidos para visualizar as etiquetas.</p>
              </div>
            </Card>
          )}

          {selectedOrders.map((order) => (
            <Card key={order.id} padding="none">
              <div className="border-b border-border-default bg-bg-elevated px-4 py-2">
                <span className="font-mono text-xs text-text-muted">{order.orderNumber}</span>
              </div>
              <div className="p-4 space-y-4">
                {/* Sender */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Remetente</p>
                  <p className="text-sm font-semibold text-text-primary">Tabacaria do Mineiro</p>
                  <p className="text-xs text-text-secondary">
                    Av. Afonso Pena, 1500 — Funcionários
                  </p>
                  <p className="text-xs text-text-secondary">
                    Belo Horizonte, MG — CEP 30130-921
                  </p>
                </div>

                <div className="border-t border-dashed border-border-default" />

                {/* Recipient */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Destinatário</p>
                  <p className="text-sm font-semibold text-text-primary">
                    Pedido #{order.orderNumber}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {order.shippingAddress.street}, {order.shippingAddress.number}
                    {order.shippingAddress.complement ? ` — ${order.shippingAddress.complement}` : ''}
                    {' — '}{order.shippingAddress.neighborhood}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {order.shippingAddress.city}, {order.shippingAddress.state} — CEP {order.shippingAddress.cep}
                  </p>
                </div>

                <div className="border-t border-dashed border-border-default" />

                {/* Tracking & weight */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Rastreio</p>
                    <p className="font-mono text-sm font-semibold text-accent-green">
                      {order.trackingCode || generateTrackingCode(order.id)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Peso</p>
                    <p className="font-mono text-sm text-text-primary">{peso} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Dimensões</p>
                    <p className="font-mono text-xs text-text-primary">
                      {comprimento}x{largura}x{altura} cm
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
