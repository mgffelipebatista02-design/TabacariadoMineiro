'use client'

import { useState } from 'react'
import { Save, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { formatCNPJ } from '@/lib/utils'
import type { CustomerB2B } from '@/types'

const PRICE_GROUP_BADGE: Record<string, { label: string; variant: 'amber' | 'green' | 'blue' }> = {
  standard: { label: 'Standard', variant: 'blue' },
  premium: { label: 'Premium', variant: 'amber' },
  vip: { label: 'VIP', variant: 'green' },
}

export default function DadosFiscaisPage() {
  const { user } = useAuth()
  const customer = user.customer as CustomerB2B | null

  const [cnpj, setCnpj] = useState(customer?.cnpj || '')
  const [razaoSocial, setRazaoSocial] = useState(customer?.razaoSocial || '')
  const [inscricaoEstadual, setInscricaoEstadual] = useState(
    customer?.inscricaoEstadual || ''
  )
  const [nomeFantasia, setNomeFantasia] = useState(
    customer?.nomeFantasia || ''
  )
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const priceGroupInfo = customer
    ? PRICE_GROUP_BADGE[customer.priceGroup]
    : null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // Mock save
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!customer) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text-primary">
          Dados Fiscais
        </h2>
        {priceGroupInfo && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Grupo de Preco:</span>
            <Badge variant={priceGroupInfo.variant}>
              {priceGroupInfo.label}
            </Badge>
          </div>
        )}
      </div>

      <Card padding="lg">
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="CNPJ"
            value={formatCNPJ(cnpj)}
            onChange={(e) =>
              setCnpj(e.target.value.replace(/\D/g, '').slice(0, 14))
            }
            placeholder="00.000.000/0000-00"
          />

          <Input
            label="Razao Social"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            placeholder="Razao Social da empresa"
          />

          <Input
            label="Inscricao Estadual"
            value={inscricaoEstadual}
            onChange={(e) => setInscricaoEstadual(e.target.value)}
            placeholder="Inscricao Estadual"
          />

          <Input
            label="Nome Fantasia"
            value={nomeFantasia}
            onChange={(e) => setNomeFantasia(e.target.value)}
            placeholder="Nome fantasia da empresa"
          />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={saving} disabled={saved}>
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Salvo
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alteracoes
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
