'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, UserCheck, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { customers } from '@/data/customers'
import type { Customer, CustomerB2B } from '@/types'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

type FilterTab = 'todos' | 'b2c' | 'b2b' | 'pendente'

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'b2c', label: 'B2C' },
  { key: 'b2b', label: 'B2B' },
  { key: 'pendente', label: 'Pendente Aprovação' },
]

const priceGroupVariant = {
  standard: 'gray' as const,
  premium: 'blue' as const,
  vip: 'olive' as const,
}

const priceGroupLabel = {
  standard: 'Standard',
  premium: 'Premium',
  vip: 'VIP',
}

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers)

  const filtered = useMemo(() => {
    let result = [...localCustomers]

    if (activeTab === 'b2c') {
      result = result.filter((c) => c.type === 'b2c')
    } else if (activeTab === 'b2b') {
      result = result.filter((c) => c.type === 'b2b')
    } else if (activeTab === 'pendente') {
      result = result.filter((c) => c.type === 'b2b' && !c.approved)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.type === 'b2c' && c.cpf.includes(q)) ||
          (c.type === 'b2b' && (c.cnpj.includes(q) || c.nomeFantasia.toLowerCase().includes(q)))
      )
    }

    return result
  }, [localCustomers, search, activeTab])

  function handleApprove(customerId: string) {
    setLocalCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId && c.type === 'b2b' ? { ...c, approved: true } : c
      )
    )
  }

  function getDocument(customer: Customer) {
    return customer.type === 'b2c' ? customer.cpf : customer.cnpj
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-text-primary">Clientes</h2>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-[--radius-lg] bg-bg-secondary p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-[--radius-md] transition-colors',
              activeTab === tab.key
                ? 'bg-accent-green text-bg-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <Card padding="md">
        <Input
          placeholder="Buscar por nome, email, CPF/CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      </Card>

      {/* Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Grupo de Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => {
              const isExpanded = expandedId === customer.id
              const isB2B = customer.type === 'b2b'
              const b2bCustomer = isB2B ? (customer as CustomerB2B) : null

              return (
                <>
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                  >
                    <TableCell>
                      <span className="font-medium">{customer.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-text-secondary text-sm">{customer.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isB2B ? 'blue' : 'gray'}>
                        {customer.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-text-secondary">
                        {getDocument(customer)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {b2bCustomer ? (
                        <Badge variant={priceGroupVariant[b2bCustomer.priceGroup]}>
                          {priceGroupLabel[b2bCustomer.priceGroup]}
                        </Badge>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {b2bCustomer ? (
                        b2bCustomer.approved ? (
                          <Badge variant="green">Aprovado</Badge>
                        ) : (
                          <Badge variant="red">Pendente</Badge>
                        )
                      ) : (
                        <Badge variant="green">Ativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-text-secondary">
                        {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-text-muted" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-text-muted" />
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded row */}
                  {isExpanded && (
                    <tr key={`${customer.id}-details`}>
                      <td colSpan={8} className="bg-bg-elevated px-6 py-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {/* Contact info */}
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">Contato</p>
                            <p className="text-sm text-text-primary">{customer.name}</p>
                            <p className="text-sm text-text-secondary">{customer.email}</p>
                            <p className="text-sm text-text-secondary">{customer.phone}</p>
                          </div>

                          {/* Document info */}
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
                              {isB2B ? 'Dados Empresariais' : 'Documento'}
                            </p>
                            {b2bCustomer ? (
                              <>
                                <p className="text-sm text-text-primary">{b2bCustomer.nomeFantasia}</p>
                                <p className="text-sm text-text-secondary">{b2bCustomer.razaoSocial}</p>
                                <p className="text-sm text-text-secondary">CNPJ: {b2bCustomer.cnpj}</p>
                                <p className="text-sm text-text-secondary">IE: {b2bCustomer.inscricaoEstadual}</p>
                              </>
                            ) : (
                              <p className="text-sm text-text-secondary">
                                CPF: {customer.type === 'b2c' ? customer.cpf : '—'}
                              </p>
                            )}
                          </div>

                          {/* Address */}
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2">Endereço Principal</p>
                            {customer.addresses.length > 0 ? (
                              <>
                                <p className="text-sm text-text-primary">
                                  {customer.addresses[0].street}, {customer.addresses[0].number}
                                  {customer.addresses[0].complement ? ` — ${customer.addresses[0].complement}` : ''}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {customer.addresses[0].neighborhood}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {customer.addresses[0].city}, {customer.addresses[0].state} — CEP {customer.addresses[0].cep}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-text-muted">Nenhum endereço cadastrado.</p>
                            )}
                          </div>
                        </div>

                        {/* Approve button for unapproved B2B */}
                        {b2bCustomer && !b2bCustomer.approved && (
                          <div className="mt-4 flex justify-end">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApprove(customer.id)
                              }}
                              variant="primary"
                              size="sm"
                            >
                              <UserCheck className="h-4 w-4" />
                              Aprovar
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Users className="h-10 w-10 mb-2" />
            <p className="text-sm">Nenhum cliente encontrado.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
