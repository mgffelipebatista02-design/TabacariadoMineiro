'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Plus, Pencil, Trash2, X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Address } from '@/types'

const addressSchema = z.object({
  label: z.string().min(1, 'Rótulo obrigatório'),
  cep: z.string().min(8, 'CEP inválido'),
  street: z.string().min(3, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
})

type AddressForm = z.infer<typeof addressSchema>

export default function EnderecosPage() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>(
    user.customer?.addresses || []
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  })

  function onSubmit(data: AddressForm) {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId ? { ...addr, ...data } : addr
        )
      )
      setEditingId(null)
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        ...data,
        complement: data.complement || undefined,
        isDefault: addresses.length === 0,
      }
      setAddresses((prev) => [...prev, newAddress])
    }
    setShowForm(false)
    reset()
  }

  function handleEdit(address: Address) {
    setEditingId(address.id)
    setValue('label', address.label)
    setValue('cep', address.cep)
    setValue('street', address.street)
    setValue('number', address.number)
    setValue('complement', address.complement || '')
    setValue('neighborhood', address.neighborhood)
    setValue('city', address.city)
    setValue('state', address.state)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    reset()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-text-primary">Endereços</h2>
        {!showForm && (
          <Button
            size="sm"
            onClick={() => {
              reset()
              setEditingId(null)
              setShowForm(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Adicionar Endereço
          </Button>
        )}
      </div>

      {showForm && (
        <Card padding="lg" className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base text-text-primary">
              {editingId ? 'Editar Endereço' : 'Novo Endereço'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Input
              label="Rótulo (ex: Casa, Trabalho)"
              error={errors.label?.message}
              {...register('label')}
            />
            <Input
              label="CEP"
              placeholder="00000-000"
              error={errors.cep?.message}
              {...register('cep')}
            />
            <Input
              label="Rua"
              error={errors.street?.message}
              className="sm:col-span-2"
              {...register('street')}
            />
            <Input
              label="Número"
              error={errors.number?.message}
              {...register('number')}
            />
            <Input
              label="Complemento"
              error={errors.complement?.message}
              {...register('complement')}
            />
            <Input
              label="Bairro"
              error={errors.neighborhood?.message}
              {...register('neighborhood')}
            />
            <Input
              label="Cidade"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="Estado"
              placeholder="UF"
              error={errors.state?.message}
              {...register('state')}
            />
            <div className="sm:col-span-2 flex gap-3 justify-end mt-2">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {addresses.length === 0 && !showForm ? (
        <Card padding="lg" className="text-center">
          <MapPin className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm">
            Nenhum endereço cadastrado.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <Card key={address.id} padding="md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <Badge variant="olive">Padrão</Badge>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {address.street}, {address.number}
                    {address.complement && ` - ${address.complement}`}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {address.neighborhood} - {address.city}/{address.state}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    CEP: {address.cep}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-[--radius-md] transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-text-muted hover:text-status-error hover:bg-status-error/10 rounded-[--radius-md] transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
